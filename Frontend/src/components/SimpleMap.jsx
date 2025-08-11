import React from 'react';

const SimpleMap = ({ latitude, longitude, venueName, address }) => {
  const openStreetMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
  
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div style={{ width: '100%', height: '200px' }}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={openStreetMapUrl}
        title={`Map showing ${venueName}`}
        style={{ borderRadius: '8px', border: '1px solid #ddd' }}
      />
    </div>
  );
};

export default SimpleMap;
