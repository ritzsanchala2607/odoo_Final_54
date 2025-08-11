# Map Integration Setup Guide

## Current Implementation

The venue details page now includes a map section that displays the venue location using **OpenStreetMap** (free, no API key required).

### Features:
- Interactive map showing venue location
- Marker indicating the exact coordinates
- "Open in Google Maps" link for navigation
- Coordinates display below the map
- Responsive design

## How to Use

### 1. Add Coordinates to Venue Data
In your venue data, include latitude and longitude coordinates:

```javascript
const venueData = {
  id: 1,
  name: "Your Venue Name",
  latitude: 23.0225,  // Add latitude
  longitude: 72.5714, // Add longitude
  address: "Your venue address",
  // ... other venue data
};
```

### 2. The Map Component
The `SimpleMap` component automatically:
- Displays an interactive map centered on your coordinates
- Shows a marker at the venue location
- Provides a link to open the location in Google Maps
- Displays the coordinates below the map

## Google Maps API Setup (Optional)

If you prefer to use Google Maps instead of OpenStreetMap:

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Maps JavaScript API"
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Update the GoogleMap Component
Replace `YOUR_GOOGLE_MAPS_API_KEY` in `src/components/GoogleMap.jsx`:

```javascript
const loader = new Loader({
  apiKey: 'your-actual-api-key-here',
  version: 'weekly',
  libraries: ['places']
});
```

### 3. Switch to Google Maps
In `VenueDetails.jsx`, change the import:

```javascript
// Replace this line:
import SimpleMap from "../components/SimpleMap";

// With this:
import GoogleMap from "../components/GoogleMap";
```

And update the component usage:

```javascript
// Replace SimpleMap with GoogleMap
<GoogleMap 
  latitude={venueData.latitude}
  longitude={venueData.longitude}
  venueName={venueData.name}
  address={venueData.address}
/>
```

## Example Venue Coordinates

Here are some example coordinates for testing:

- **Ahmedabad**: 23.0225, 72.5714
- **Mumbai**: 19.0760, 72.8777  
- **Delhi**: 28.7041, 77.1025
- **Bangalore**: 12.9716, 77.5946

## Backend Integration

To integrate with your backend:

1. Add `latitude` and `longitude` fields to your venue database schema
2. Update your venue API endpoints to include these coordinates
3. Modify the frontend to fetch venue data from your API instead of using static data

## Troubleshooting

### Map Not Loading
- Check if coordinates are valid numbers
- Ensure internet connection for map tiles
- Check browser console for errors

### Google Maps API Issues
- Verify API key is correct and enabled
- Check API key restrictions
- Ensure billing is enabled for Google Cloud project

### Performance
- The current OpenStreetMap implementation is lightweight
- Google Maps may require additional optimization for mobile devices
