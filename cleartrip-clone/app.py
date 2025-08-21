from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import csv
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Flight data storage
flights_data = []

def load_flights_from_csv():
    """Load flight data from CSV file"""
    global flights_data
    csv_file = 'flights_data.csv'
    
    if not os.path.exists(csv_file):
        print(f"CSV file {csv_file} not found!")
        return []
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            flights_data = list(csv_reader)
            print(f"Loaded {len(flights_data)} flights from CSV")
            
            # Debug: Check for None values in the data
            for i, flight in enumerate(flights_data):
                for key, value in flight.items():
                    if value is None:
                        print(f"Warning: Flight {i+1} has None value for {key}")
            
            return flights_data
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return []

def get_city_name(airport_code):
    """Convert airport code to full city name"""
    if not airport_code:
        return ''
    
    city_map = {
        'BLR': 'Bangalore',
        'BOM': 'Mumbai',
        'DEL': 'Delhi',
        'HYD': 'Hyderabad'
    }
    return city_map.get(airport_code, airport_code)

@app.route('/')
def index():
    """Serve the main trip planning page"""
    return render_template('trip-planning.html')

@app.route('/api/flights')
def get_flights():
    """Get all flights"""
    try:
        # Add city names for display
        for flight in flights_data:
            flight['origin_city'] = get_city_name(flight.get('Origin'))
            flight['destination_city'] = get_city_name(flight.get('Destination'))
        
        return jsonify({
            'success': True,
            'count': len(flights_data),
            'flights': flights_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/flights/search')
def search_flights():
    """Search flights by various criteria"""
    try:
        query = request.args.get('q', '').lower()
        origin = request.args.get('origin', '')
        destination = request.args.get('destination', '')
        airline = request.args.get('airline', '')
        max_price = request.args.get('max_price', '')
        
        print(f"Search request - Query: '{query}', Origin: '{origin}', Destination: '{destination}', Airline: '{airline}'")
        
        filtered_flights = flights_data.copy()
        print(f'len of filtered flights: {len(filtered_flights)}')
        
        # Search by query
        if query:
            try:
                filtered_flights = [
                    flight for flight in filtered_flights
                    if (flight.get('FlightNumber') and query in flight['FlightNumber'].lower() or
                        flight.get('Airline') and query in flight['Airline'].lower() or
                        flight.get('Origin') and query in get_city_name(flight['Origin']).lower() or
                        flight.get('Destination') and query in get_city_name(flight['Destination']).lower())
                ]
                print(f"After query filter: {len(filtered_flights)} flights")
            except Exception as e:
                print(f"Error in query filter: {e}")
                filtered_flights = []
        
        # Filter by origin
        if origin:
            try:
                filtered_flights = [
                    flight for flight in filtered_flights
                    if flight.get('Origin') and flight['Origin'] == origin
                ]
                print(f"After origin filter: {len(filtered_flights)} flights")
            except Exception as e:
                print(f"Error in origin filter: {e}")
                filtered_flights = []
        
        # Filter by destination
        if destination:
            try:
                filtered_flights = [
                    flight for flight in filtered_flights
                    if flight.get('Destination') and flight['Destination'] == destination
                ]
                print(f"After destination filter: {len(filtered_flights)} flights")
            except Exception as e:
                print(f"Error in destination filter: {e}")
                filtered_flights = []
        
        # Filter by airline
        if airline:
            try:
                filtered_flights = [
                    flight for flight in filtered_flights
                    if flight.get('Airline') and flight['Airline'] == airline
                ]
                print(f"After airline filter: {len(filtered_flights)} flights")
            except Exception as e:
                print(f"Error in airline filter: {e}")
                filtered_flights = []
        
        # Filter by max price
        if max_price:
            try:
                max_price_int = int(max_price.replace('₹', '').replace(',', ''))
                filtered_flights = [
                    flight for flight in filtered_flights
                    if flight.get('Price') and int(flight['Price'].replace('₹', '').replace(',', '')) <= max_price_int
                ]
                print(f"After price filter: {len(filtered_flights)} flights")
            except ValueError:
                pass

        # print('here fine')
        
        # Add city names for display
        for flight in filtered_flights:
            flight['origin_city'] = get_city_name(flight.get('Origin'))
            flight['destination_city'] = get_city_name(flight.get('Destination'))
        
        print(f"Final result: {len(filtered_flights)} flights")
        print(filtered_flights)
        
        
        return jsonify({
            'success': True,
            'count': len(filtered_flights),
            'flights': filtered_flights
        })
    except Exception as e:
        print(f"Error in search_flights: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/flights/<flight_number>')
def get_flight_details(flight_number):
    """Get details of a specific flight"""
    try:
        flight = next(
            (f for f in flights_data if f['FlightNumber'] == flight_number),
            None
        )
        
        if not flight:
            return jsonify({
                'success': False,
                'error': 'Flight not found'
            }), 404
        
        # Add city names
        flight['origin_city'] = get_city_name(flight['Origin'])
        flight['destination_city'] = get_city_name(flight['Destination'])
        
        return jsonify({
            'success': True,
            'flight': flight
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/flights/stats')
def get_flight_stats():
    """Get flight statistics"""
    try:
        airlines = {}
        routes = {}
        price_ranges = {
            'Under ₹3,000': 0,
            '₹3,000 - ₹4,000': 0,
            '₹4,000 - ₹5,000': 0,
            'Above ₹5,000': 0
        }
        
        for flight in flights_data:
            # Count airlines
            airline = flight['Airline']
            airlines[airline] = airlines.get(airline, 0) + 1
            
            # Count routes
            route = f"{get_city_name(flight['Origin'])} → {get_city_name(flight['Destination'])}"
            routes[route] = routes.get(route, 0) + 1
            
            # Count price ranges
            price = int(flight['Price'].replace('₹', '').replace(',', ''))
            if price < 3000:
                price_ranges['Under ₹3,000'] += 1
            elif price < 4000:
                price_ranges['₹3,000 - ₹4,000'] += 1
            elif price < 5000:
                price_ranges['₹4,000 - ₹5,000'] += 1
            else:
                price_ranges['Above ₹5,000'] += 1
        
        return jsonify({
            'success': True,
            'stats': {
                'total_flights': len(flights_data),
                'airlines': airlines,
                'routes': routes,
                'price_ranges': price_ranges
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/airlines')
def get_airlines():
    """Get list of all airlines"""
    try:
        airlines = list(set(flight['Airline'] for flight in flights_data))
        return jsonify({
            'success': True,
            'airlines': airlines
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/cities')
def get_cities():
    """Get list of all cities"""
    try:
        cities = set()
        for flight in flights_data:
            cities.add(flight['Origin'])
            cities.add(flight['Destination'])
        
        city_list = [
            {
                'code': city,
                'name': get_city_name(city)
            }
            for city in sorted(cities)
        ]
        
        return jsonify({
            'success': True,
            'cities': city_list
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/debug/filters')
def debug_filters():
    """Debug endpoint to test filters"""
    try:
        # Test different filter combinations
        test_cases = [
            {'origin': 'BLR'},
            {'destination': 'BOM'},
            {'airline': 'IndiGo'},
            {'origin': 'BLR', 'destination': 'BOM'},
            {'airline': 'IndiGo', 'origin': 'BLR'},
            {'q': 'indigo'},
            {'q': 'bangalore'}
        ]
        
        results = {}
        for test_case in test_cases:
            filtered_flights = flights_data.copy()
            
            if 'q' in test_case:
                query = test_case['q'].lower()
                filtered_flights = [
                    flight for flight in filtered_flights
                    if (query in flight['FlightNumber'].lower() or
                        query in flight['Airline'].lower() or
                        query in get_city_name(flight['Origin']).lower() or
                        query in get_city_name(flight['Destination']).lower())
                ]
            
            if 'origin' in test_case:
                filtered_flights = [
                    flight for flight in filtered_flights
                    if flight['Origin'] == test_case['origin']
                ]
            
            if 'destination' in test_case:
                filtered_flights = [
                    flight for flight in filtered_flights
                    if flight['Destination'] == test_case['destination']
                ]
            
            if 'airline' in test_case:
                filtered_flights = [
                    flight for flight in filtered_flights
                    if flight['Airline'] == test_case['airline']
                ]
            
            results[str(test_case)] = {
                'count': len(filtered_flights),
                'flights': [f['FlightNumber'] for f in filtered_flights[:5]]  # Show first 5
            }
        
        return jsonify({
            'success': True,
            'total_flights': len(flights_data),
            'test_results': results
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/book-flight', methods=['POST'])
def book_flight():
    """Book a flight (mock booking)"""
    try:
        data = request.get_json()
        flight_number = data.get('flight_number')
        
        if not flight_number:
            return jsonify({
                'success': False,
                'error': 'Flight number is required'
            }), 400
        
        # Find the flight
        flight = next(
            (f for f in flights_data if f['FlightNumber'] == flight_number),
            None
        )
        
        if not flight:
            return jsonify({
                'success': False,
                'error': 'Flight not found'
            }), 404
        
        # Mock booking response
        booking_id = f"BK{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        return jsonify({
            'success': True,
            'booking_id': booking_id,
            'flight': flight,
            'message': f'Flight {flight_number} booked successfully!'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    # Load flights data on startup
    load_flights_from_csv()
    
    print("🚀 Flight API Server Starting...")
    print(f"📊 Loaded {len(flights_data)} flights")
    print("🌐 Available endpoints:")
    print("   GET  /api/flights - Get all flights")
    print("   GET  /api/flights/search - Search flights")
    print("   GET  /api/flights/<number> - Get flight details")
    print("   GET  /api/flights/stats - Get flight statistics")
    print("   GET  /api/airlines - Get all airlines")
    print("   GET  /api/cities - Get all cities")
    print("   POST /api/book-flight - Book a flight")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
