import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faDoorClosed } from '@fortawesome/free-solid-svg-icons';

function LeafletMapComponent() {
  let date = new Date();
  let hours = date.getHours();
  
  return (
    <div className='relative'>
      <div className='absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md z-10'></div>
      
      <MapContainer center={[21.4892, 70.077]} zoom={13} style={{height:'400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[21.4892, 70.077]}>
          <Popup>
            Our Office. {hours > 10 && hours < 18 ? <FontAwesomeIcon icon={faDoorOpen} className='text-green-500' /> : <FontAwesomeIcon icon={faDoorClosed} className='text-red-500' />}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default LeafletMapComponent;
