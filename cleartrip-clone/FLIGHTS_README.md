# Flight Data and Functionality Documentation

## Overview
This document describes the flight data structure and functionality implemented in the Trip Planning module of the Cleartrip clone.

## Flight Data Structure

### CSV File: `flights_data.csv`
The flight data is stored in a CSV file with the following structure:

| Column | Description | Example |
|--------|-------------|---------|
| FlightNumber | Unique flight identifier | 6E-101 |
| Airline | Airline name | IndiGo, SpiceJet, Air India |
| Origin | Departure airport code | BLR, BOM, DEL, HYD |
| Destination | Arrival airport code | BLR, BOM, DEL, HYD |
| DepartureTime | Flight departure time | 06:00 |
| ArrivalTime | Flight arrival time | 07:30 |
| Duration | Flight duration | 1h 30m |
| Price | Ticket price in INR | ₹3,200 |
| Stops | Number of stops | 0 (Direct) |
| Class | Travel class | Economy |
| Status | Flight status | On Time |

## Flight Data Details

### Airlines Included
1. **IndiGo (6E)** - 7 flights
2. **SpiceJet (SG)** - 7 flights  
3. **Air India (AI)** - 6 flights

### Routes Covered
The 20 flights cover all major routes between:
- **BLR** (Bangalore)
- **BOM** (Mumbai)
- **DEL** (Delhi)
- **HYD** (Hyderabad)

### Sample Flight Data
```
FlightNumber: 6E-101
Airline: IndiGo
Origin: BLR
Destination: BOM
DepartureTime: 06:00
ArrivalTime: 07:30
Duration: 1h 30m
Price: ₹3,200
Stops: 0
Class: Economy
Status: On Time
```

## Functionality Features

### 1. Dynamic Flight Loading
- Flights are loaded from the CSV file on page load
- Fallback to hardcoded data if CSV loading fails
- Real-time display of all available flights

### 2. Search Functionality
- Search by airline name
- Search by flight number
- Search by route (origin/destination)
- Real-time search results

### 3. Filter Options
- Filter by origin airport
- Filter by destination airport
- Filter by airline
- Clear all filters option

### 4. Flight Cards Display
Each flight is displayed in a card showing:
- Route (Origin → Destination)
- Price
- Flight number and airline
- Duration
- Departure and arrival times
- Number of stops
- Flight status
- Action buttons (Book Now, View Details)

### 5. Interactive Features
- **Book Now**: Initiates booking process (shows alert)
- **View Details**: Shows detailed flight information
- **Hover Effects**: Cards lift on hover
- **Responsive Design**: Works on different screen sizes

## Technical Implementation

### Files Structure
```
├── flights_data.csv          # Flight data in CSV format
├── js/flights.js            # Flight functionality JavaScript
├── trip-planning.html       # Main trip planning page
└── FLIGHTS_README.md        # This documentation
```

### JavaScript Functions

#### Core Functions
- `loadFlightsFromCSV()` - Loads flight data from CSV
- `parseCSV(csvText)` - Parses CSV data into JavaScript objects
- `displayFlights()` - Displays all flights in the UI
- `createFlightCard(flight)` - Creates individual flight cards

#### Search and Filter Functions
- `searchFlights(query)` - Searches flights by various criteria
- `filterFlights(filters)` - Filters flights by origin, destination, airline
- `applyFilters()` - Applies selected filters
- `clearFilters()` - Clears all filters

#### Interactive Functions
- `bookFlight(flightNumber)` - Handles flight booking
- `viewFlightDetails(flightNumber)` - Shows detailed flight info

### CSS Styling
- Modern card-based design
- Hover effects and transitions
- Responsive grid layout
- Status color coding (On Time: Green, Delayed: Yellow, Cancelled: Red)
- Search and filter section styling

## Usage Instructions

1. **Viewing Flights**: Navigate to Trip Planning → Flights tab
2. **Searching**: Use the search box to find specific flights
3. **Filtering**: Use dropdown filters to narrow down results
4. **Booking**: Click "Book Now" on any flight card
5. **Details**: Click "View Details" for comprehensive flight information

## Data Management

### Adding New Flights
To add new flights, simply add new rows to the `flights_data.csv` file following the existing format.

### Updating Flight Data
- Modify the CSV file to update flight information
- The changes will be reflected immediately on page reload
- No code changes required for data updates

### Extending Functionality
The modular design allows easy extension:
- Add new airlines by updating the airline filter options
- Add new routes by including new airport codes
- Add new features by extending the JavaScript functions

## Browser Compatibility
- Modern browsers with ES6+ support
- Requires fetch API for CSV loading
- Fallback data available if CSV loading fails

## Performance Considerations
- CSV data is loaded once on page load
- Search and filter operations are performed client-side
- Efficient DOM manipulation for dynamic content updates
