// Flight data management
let flightsData = [];

// Function to load flights from CSV
async function loadFlightsFromCSV() {
    try {
        console.log('Starting to load CSV...');
        const response = await fetch('flights_data.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        console.log('CSV loaded successfully, length:', csvText.length);
        console.log('CSV content preview:', csvText.substring(0, 200) + '...');
        
        flightsData = parseCSV(csvText);
        console.log('Parsed flights data:', flightsData.length, 'flights');
        
        if (flightsData.length === 0) {
            throw new Error('No flights parsed from CSV');
        }
        
        displayFlights();
    } catch (error) {
        console.error('Error loading flights data:', error);
        console.log('Falling back to hardcoded data...');
        // Fallback to hardcoded data if CSV fails to load
        loadFallbackFlights();
    }
}

// Function to parse CSV data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    console.log('CSV lines:', lines.length);
    const headers = lines[0].split(',');
    console.log('Headers:', headers);
    const flights = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue; // Skip empty lines
        
        const values = lines[i].split(',');
        const flight = {};
        
        headers.forEach((header, index) => {
            flight[header.trim()] = values[index] ? values[index].trim() : '';
        });
        
        flights.push(flight);
    }
    
    console.log('Parsed flights:', flights.length);
    return flights;
}

// Fallback flight data if CSV loading fails
function loadFallbackFlights() {
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
            Status: 'On Time'
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
            Status: 'On Time'
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
            Status: 'On Time'
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
            Status: 'On Time'
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
            Status: 'On Time'
        }
    ];
    displayFlights();
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
    
    // Get city names for display
    const originCity = getCityName(flight.Origin);
    const destinationCity = getCityName(flight.Destination);
    
    card.innerHTML = `
        <div class="card-header">
            <div class="card-title">${originCity} → ${destinationCity}</div>
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
            <button class="btn-primary" onclick="bookFlight('${flight.FlightNumber}')">Book Now</button>
            <button class="btn-secondary" onclick="viewFlightDetails('${flight.FlightNumber}')">View Details</button>
        </div>
    `;
    
    return card;
}

// Function to get full city names
function getCityName(airportCode) {
    const cityMap = {
        'BLR': 'Bangalore',
        'BOM': 'Mumbai',
        'DEL': 'Delhi',
        'HYD': 'Hyderabad'
    };
    return cityMap[airportCode] || airportCode;
}

// Function to book a flight
function bookFlight(flightNumber) {
    const flight = flightsData.find(f => f.FlightNumber === flightNumber);
    if (flight) {
        alert(`Booking initiated for ${flight.Airline} flight ${flightNumber} from ${getCityName(flight.Origin)} to ${getCityName(flight.Destination)}`);
        // Here you would typically redirect to a booking page or open a booking modal
    }
}

// Function to view flight details
function viewFlightDetails(flightNumber) {
    const flight = flightsData.find(f => f.FlightNumber === flightNumber);
    if (flight) {
        const details = `
Flight Details:
- Flight Number: ${flight.FlightNumber}
- Airline: ${flight.Airline}
- Route: ${getCityName(flight.Origin)} → ${getCityName(flight.Destination)}
- Departure: ${flight.DepartureTime}
- Arrival: ${flight.ArrivalTime}
- Duration: ${flight.Duration}
- Price: ${flight.Price}
- Class: ${flight.Class}
- Status: ${flight.Status}
        `;
        alert(details);
    }
}

// Function to filter flights
function filterFlights(filters = {}) {
    let filteredFlights = [...flightsData];
    
    if (filters.origin) {
        filteredFlights = filteredFlights.filter(f => f.Origin === filters.origin);
    }
    
    if (filters.destination) {
        filteredFlights = filteredFlights.filter(f => f.Destination === filters.destination);
    }
    
    if (filters.airline) {
        filteredFlights = filteredFlights.filter(f => f.Airline === filters.airline);
    }
    
    if (filters.maxPrice) {
        filteredFlights = filteredFlights.filter(f => {
            const price = parseInt(f.Price.replace(/[₹,]/g, ''));
            return price <= filters.maxPrice;
        });
    }
    
    return filteredFlights;
}

// Function to search flights
function searchFlights(query) {
    if (!query) return flightsData;
    
    const searchTerm = query.toLowerCase();
    return flightsData.filter(flight => 
        flight.FlightNumber.toLowerCase().includes(searchTerm) ||
        flight.Airline.toLowerCase().includes(searchTerm) ||
        getCityName(flight.Origin).toLowerCase().includes(searchTerm) ||
        getCityName(flight.Destination).toLowerCase().includes(searchTerm)
    );
}

// Initialize flights when DOM is loaded (moved to main script)
// document.addEventListener('DOMContentLoaded', function() {
//     loadFlightsFromCSV();
// });

// Export functions for use in other scripts
window.flightsModule = {
    loadFlightsFromCSV,
    displayFlights,
    filterFlights,
    searchFlights,
    bookFlight,
    viewFlightDetails,
    createFlightCard,
    getCityName
};

// Make key functions globally accessible
window.createFlightCard = createFlightCard;
window.getCityName = getCityName;
window.bookFlight = bookFlight;
window.viewFlightDetails = viewFlightDetails;

// Debug function to test CSV loading
window.debugFlights = function() {
    console.log('=== FLIGHTS DEBUG ===');
    console.log('flightsData length:', flightsData.length);
    console.log('flightsData:', flightsData);
    console.log('flightsModule available:', !!window.flightsModule);
    console.log('createFlightCard available:', !!window.createFlightCard);
    
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
