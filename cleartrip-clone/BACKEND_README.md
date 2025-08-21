# Python Flask Backend for Flight Data API

## Overview
This is a Python Flask backend that provides a REST API for managing flight data. It replaces the client-side CSV loading with a robust server-side solution.

## Features

### 🚀 **API Endpoints**
- **GET** `/api/flights` - Get all flights
- **GET** `/api/flights/search` - Search flights with filters
- **GET** `/api/flights/<flight_number>` - Get specific flight details
- **GET** `/api/flights/stats` - Get flight statistics
- **GET** `/api/airlines` - Get all airlines
- **GET** `/api/cities` - Get all cities
- **POST** `/api/book-flight` - Book a flight (mock)

### 📊 **Data Management**
- Loads flight data from CSV file on startup
- Provides real-time search and filtering
- Returns JSON responses with proper error handling
- Includes city name mapping for better UX

## Installation & Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Server
```bash
python app.py
```

The server will start on `http://localhost:5000`

### 3. Access the Application
- **Main Page**: `http://localhost:5000/`
- **API Base**: `http://localhost:5000/api/`

## API Documentation

### Get All Flights
```http
GET /api/flights
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "flights": [
    {
      "FlightNumber": "6E-101",
      "Airline": "IndiGo",
      "Origin": "BLR",
      "Destination": "BOM",
      "DepartureTime": "06:00",
      "ArrivalTime": "07:30",
      "Duration": "1h 30m",
      "Price": "₹3,200",
      "Stops": "0",
      "Class": "Economy",
      "Status": "On Time",
      "origin_city": "Bangalore",
      "destination_city": "Mumbai"
    }
  ]
}
```

### Search Flights
```http
GET /api/flights/search?q=indigo&origin=BLR&destination=BOM&airline=IndiGo&max_price=4000
```

**Query Parameters:**
- `q` - Search query (flight number, airline, city)
- `origin` - Origin airport code
- `destination` - Destination airport code
- `airline` - Airline name
- `max_price` - Maximum price filter

### Get Flight Details
```http
GET /api/flights/6E-101
```

### Get Flight Statistics
```http
GET /api/flights/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_flights": 20,
    "airlines": {
      "IndiGo": 7,
      "SpiceJet": 7,
      "Air India": 6
    },
    "routes": {
      "Bangalore → Mumbai": 3,
      "Mumbai → Delhi": 3
    },
    "price_ranges": {
      "Under ₹3,000": 5,
      "₹3,000 - ₹4,000": 8,
      "₹4,000 - ₹5,000": 4,
      "Above ₹5,000": 3
    }
  }
}
```

### Book a Flight
```http
POST /api/book-flight
Content-Type: application/json

{
  "flight_number": "6E-101"
}
```

**Response:**
```json
{
  "success": true,
  "booking_id": "BK20241201123456",
  "flight": { ... },
  "message": "Flight 6E-101 booked successfully!"
}
```

## File Structure

```
├── app.py                 # Main Flask application
├── flights_data.csv       # Flight data source
├── requirements.txt       # Python dependencies
├── js/flights-api.js      # Frontend API client
├── trip-planning.html     # Main web page
└── BACKEND_README.md      # This documentation
```

## Benefits of Python Backend

### ✅ **Advantages**
1. **Better Performance** - Server-side processing is faster
2. **Data Security** - CSV data not exposed to client
3. **Scalability** - Easy to add database, caching, etc.
4. **Error Handling** - Proper HTTP status codes and error messages
5. **Extensibility** - Easy to add new features and endpoints
6. **CORS Support** - Handles cross-origin requests properly
7. **Real-time Updates** - Can easily add real-time data updates

### 🔧 **Technical Features**
- **Flask Framework** - Lightweight and flexible
- **CORS Support** - Handles cross-origin requests
- **JSON Responses** - Standardized API responses
- **Error Handling** - Proper HTTP status codes
- **CSV Integration** - Loads data from CSV file
- **Search & Filter** - Advanced search capabilities

## Development

### Adding New Endpoints
```python
@app.route('/api/new-endpoint')
def new_endpoint():
    try:
        # Your logic here
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
```

### Adding New Data Sources
```python
def load_data_from_database():
    # Connect to database
    # Load data
    # Return formatted data
    pass
```

### Environment Variables
Create a `.env` file for configuration:
```env
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
```

## Testing the API

### Using curl
```bash
# Get all flights
curl http://localhost:5000/api/flights

# Search flights
curl "http://localhost:5000/api/flights/search?q=indigo"

# Book a flight
curl -X POST http://localhost:5000/api/book-flight \
  -H "Content-Type: application/json" \
  -d '{"flight_number": "6E-101"}'
```

### Using Python requests
```python
import requests

# Get all flights
response = requests.get('http://localhost:5000/api/flights')
flights = response.json()

# Search flights
params = {'q': 'indigo', 'origin': 'BLR'}
response = requests.get('http://localhost:5000/api/flights/search', params=params)
results = response.json()
```

## Deployment

### Production Setup
1. **Use WSGI Server** (Gunicorn, uWSGI)
2. **Add Environment Variables**
3. **Configure CORS for production**
4. **Add Database Integration**
5. **Add Authentication/Authorization**

### Example with Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Troubleshooting

### Common Issues
1. **CORS Errors** - Ensure CORS is properly configured
2. **CSV Not Found** - Check file path and permissions
3. **Port Already in Use** - Change port in app.py
4. **Module Not Found** - Install requirements.txt

### Debug Mode
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

## Future Enhancements

### 🚀 **Planned Features**
1. **Database Integration** - PostgreSQL/MySQL
2. **Authentication** - JWT tokens
3. **Caching** - Redis for performance
4. **Real-time Updates** - WebSocket support
5. **Payment Integration** - Stripe/PayPal
6. **Email Notifications** - Booking confirmations
7. **Admin Panel** - Flight management interface
8. **Analytics** - Booking statistics and reports

### 🔧 **Technical Improvements**
1. **API Versioning** - `/api/v1/flights`
2. **Rate Limiting** - Prevent abuse
3. **Logging** - Structured logging
4. **Testing** - Unit and integration tests
5. **Documentation** - Swagger/OpenAPI
6. **Monitoring** - Health checks and metrics
