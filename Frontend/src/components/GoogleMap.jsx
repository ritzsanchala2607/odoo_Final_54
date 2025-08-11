import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMap = ({ latitude, longitude, venueName, address }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your actual API key
        version: 'weekly',
        libraries: ['places']
      });

      try {
        const google = await loader.load();
        
        const position = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
        
        const map = new google.maps.Map(mapRef.current, {
          center: position,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        // Add marker
        new google.maps.Marker({
          position: position,
          map: map,
          title: venueName,
          animation: google.maps.Animation.DROP
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="margin: 0 0 5px 0; color: #4B0082; font-size: 16px;">${venueName}</h3>
              <p style="margin: 0; color: #666; font-size: 14px;">${address}</p>
            </div>
          `
        });

        // Show info window on marker click
        const marker = new google.maps.Marker({
          position: position,
          map: map,
          title: venueName,
          animation: google.maps.Animation.DROP
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        // Fallback to a simple div with coordinates
        mapRef.current.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f8f8f8; border-radius: 8px; padding: 20px;">
            <div style="font-size: 24px; margin-bottom: 10px;">📍</div>
            <div style="font-weight: bold; color: #4B0082; margin-bottom: 5px;">${venueName}</div>
            <div style="color: #666; text-align: center; margin-bottom: 10px;">${address}</div>
            <div style="background: white; padding: 10px; border-radius: 6px; font-family: monospace; color: #333;">
              Lat: ${latitude}<br/>
              Lng: ${longitude}
            </div>
          </div>
        `;
      }
    };

    if (latitude && longitude) {
      initMap();
    }
  }, [latitude, longitude, venueName, address]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '200px', 
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #ddd'
      }}
    />
  );
};

export default GoogleMap;
