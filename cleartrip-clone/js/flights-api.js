// Flight API management for Python backend
let flightsData = [];
const API_BASE_URL = 'http://localhost:5000/api';

// Function to load flights from API
async function loadFlightsFromAPI() {
    try {
        console.log('Loading flights from API...');
        const response = await fetch(`${API_BASE_URL}/flights`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            flightsData = data.flights;
            console.log(`Loaded ${flightsData.length} flights from API`);
            displayFlights();
        } else {
            throw new Error(data.error || 'Failed to load flights');
        }
    } catch (error) {
        console.error('Error loading flights from API:', error);
        // Fallback to hardcoded data if API fails
        loadFallbackFlights();
    }
}

// Function to search flights via API
async function searchFlightsAPI(params = {}) {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.query) queryParams.append('q', params.query);
        if (params.origin) queryParams.append('origin', params.origin);
        if (params.destination) queryParams.append('destination', params.destination);
        if (params.airline) queryParams.append('airline', params.airline);
        if (params.maxPrice) queryParams.append('max_price', params.maxPrice);
        
        const url = `${API_BASE_URL}/flights/search?${queryParams.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            return data.flights;
        } else {
            throw new Error(data.error || 'Search failed');
        }
    } catch (error) {
        console.error('Error searching flights:', error);
        return [];
    }
}

// Function to get flight details via API
async function getFlightDetailsAPI(flightNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/flights/${flightNumber}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            return data.flight;
        } else {
            throw new Error(data.error || 'Flight not found');
        }
    } catch (error) {
        console.error('Error getting flight details:', error);
        return null;
    }
}

// Function to book flight via API
async function bookFlightAPI(flightNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/book-flight`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ flight_number: flightNumber })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            return data;
        } else {
            throw new Error(data.error || 'Booking failed');
        }
    } catch (error) {
        console.error('Error booking flight:', error);
        return null;
    }
}

// Function to get flight statistics via API
async function getFlightStatsAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/flights/stats`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            return data.stats;
        } else {
            throw new Error(data.error || 'Failed to get stats');
        }
    } catch (error) {
        console.error('Error getting flight stats:', error);
        return null;
    }
}

// Function to get airlines via API
async function getAirlinesAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/airlines`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            return data.airlines;
        } else {
            throw new Error(data.error || 'Failed to get airlines');
        }
    } catch (error) {
        console.error('Error getting airlines:', error);
        return [];
    }
}

// Function to get cities via API
async function getCitiesAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/cities`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            return data.cities;
        } else {
            throw new Error(data.error || 'Failed to get cities');
        }
    } catch (error) {
        console.error('Error getting cities:', error);
        return [];
    }
}

// Function to display flights in the flights tab
function displayFlights() {
    console.log('Displaying flights, total:', flightsData.length);
    const flightsContainer = document.getElementById('flights');
    if (!flightsContainer) {
        console.error('Flights container not found');
        return;
    }
    
    const resultsGrid = flightsContainer.querySelector('.results-grid');
    if (!resultsGrid) {
        console.error('Results grid not found');
        return;
    }
    
    // Clear existing content
    resultsGrid.innerHTML = '';
    
    if (flightsData.length === 0) {
        resultsGrid.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h3>No flights available</h3>
                <p>Please try again later or contact support.</p>
            </div>
        `;
        return;
    }
    
    // Add flight cards
    flightsData.forEach((flight, index) => {
        console.log(`Creating card for flight ${index + 1}:`, flight.FlightNumber);
        const flightCard = createFlightCard(flight);
        resultsGrid.appendChild(flightCard);
    });
    
    console.log('Flight cards created:', resultsGrid.children.length);
}

// Function to create a flight card
function createFlightCard(flight) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    card.innerHTML = `
        <div class="card-header">
            <div class="card-title">${flight.origin_city} → ${flight.destination_city}</div>
            <div class="card-price">${flight.Price}</div>
        </div>
        <div class="card-details">
            <div class="detail-item">
                <div class="detail-label">Flight</div>
                <div class="detail-value">${flight.FlightNumber} (${flight.Airline})</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Duration</div>
                <div class="detail-value">${flight.Duration}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Departure</div>
                <div class="detail-value">${flight.DepartureTime}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Arrival</div>
                <div class="detail-value">${flight.ArrivalTime}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Stops</div>
                <div class="detail-value">${flight.Stops === '0' ? 'Direct' : flight.Stops + ' stop(s)'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value status-${flight.Status.toLowerCase().replace(' ', '-')}">${flight.Status}</div>
            </div>
        </div>
        <div class="card-actions">
            <button class="btn-primary" onclick="bookFlightAPI('${flight.FlightNumber}')">Book Now</button>
            <button class="btn-secondary" onclick="viewFlightDetailsAPI('${flight.FlightNumber}')">View Details</button>
        </div>
    `;
    
    return card;
}

// Function to view flight details via API
async function viewFlightDetailsAPI(flightNumber) {
    const flight = await getFlightDetailsAPI(flightNumber);
    if (flight) {
        const details = `
Flight Details:
- Flight Number: ${flight.FlightNumber}
- Airline: ${flight.Airline}
- Route: ${flight.origin_city} → ${flight.destination_city}
- Departure: ${flight.DepartureTime}
- Arrival: ${flight.ArrivalTime}
- Duration: ${flight.Duration}
- Price: ${flight.Price}
- Class: ${flight.Class}
- Status: ${flight.Status}
        `;
        alert(details);
    } else {
        alert('Failed to load flight details');
    }
}

// Function to book flight (updated for API)
async function bookFlightAPI(flightNumber) {
    const result = await bookFlightAPI(flightNumber);
    if (result) {
        alert(`✅ ${result.message}\nBooking ID: ${result.booking_id}`);
    } else {
        alert('❌ Failed to book flight. Please try again.');
    }
}

// Fallback flight data if API fails
function loadFallbackFlights() {
    console.log('Loading fallback flight data...');
    flightsData = [
        {
            FlightNumber: '6E-101',
            Airline: 'IndiGo',
            Origin: 'BLR',
            Destination: 'BOM',
            DepartureTime: '06:00',
            ArrivalTime: '07:30',
            Duration: '1h 30m',
            Price: '₹3,200',
            Stops: '0',
            Class: 'Economy',
            Status: 'On Time',
            origin_city: 'Bangalore',
            destination_city: 'Mumbai'
        },
        {
            FlightNumber: '6E-205',
            Airline: 'IndiGo',
            Origin: 'BOM',
            Destination: 'DEL',
            DepartureTime: '08:15',
            ArrivalTime: '10:25',
            Duration: '2h 10m',
            Price: '₹4,800',
            Stops: '0',
            Class: 'Economy',
            Status: 'On Time',
            origin_city: 'Mumbai',
            destination_city: 'Delhi'
        },
        {
            FlightNumber: 'SG-701',
            Airline: 'SpiceJet',
            Origin: 'BOM',
            Destination: 'BLR',
            DepartureTime: '07:30',
            ArrivalTime: '09:00',
            Duration: '1h 30m',
            Price: '₹3,500',
            Stops: '0',
            Class: 'Economy',
            Status: 'On Time',
            origin_city: 'Mumbai',
            destination_city: 'Bangalore'
        },
        {
            FlightNumber: 'AI-201',
            Airline: 'Air India',
            Origin: 'BOM',
            Destination: 'DEL',
            DepartureTime: '06:30',
            ArrivalTime: '08:45',
            Duration: '2h 15m',
            Price: '₹5,100',
            Stops: '0',
            Class: 'Economy',
            Status: 'On Time',
            origin_city: 'Mumbai',
            destination_city: 'Delhi'
        },
        {
            FlightNumber: '6E-312',
            Airline: 'IndiGo',
            Origin: 'DEL',
            Destination: 'HYD',
            DepartureTime: '11:00',
            ArrivalTime: '13:15',
            Duration: '2h 15m',
            Price: '₹3,900',
            Stops: '0',
            Class: 'Economy',
            Status: 'On Time',
            origin_city: 'Delhi',
            destination_city: 'Hyderabad'
        }
    ];
    displayFlights();
}

// Export functions for use in other scripts
window.flightsAPIModule = {
    loadFlightsFromAPI,
    searchFlightsAPI,
    getFlightDetailsAPI,
    bookFlightAPI,
    getFlightStatsAPI,
    getAirlinesAPI,
    getCitiesAPI,
    displayFlights,
    createFlightCard,
    viewFlightDetailsAPI
};

// Make key functions globally accessible
window.createFlightCard = createFlightCard;
window.bookFlightAPI = bookFlightAPI;
window.viewFlightDetailsAPI = viewFlightDetailsAPI;

// Debug function
window.debugFlightsAPI = function() {
    console.log('=== FLIGHTS API DEBUG ===');
    console.log('flightsData length:', flightsData.length);
    console.log('flightsData:', flightsData);
    console.log('flightsAPIModule available:', !!window.flightsAPIModule);
    console.log('API_BASE_URL:', API_BASE_URL);
    
    const flightsContainer = document.getElementById('flights');
    console.log('flights container found:', !!flightsContainer);
    
    if (flightsContainer) {
        const resultsGrid = flightsContainer.querySelector('.results-grid');
        console.log('results grid found:', !!resultsGrid);
        if (resultsGrid) {
            console.log('results grid children:', resultsGrid.children.length);
        }
    }
};
