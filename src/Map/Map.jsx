import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import LeafLet from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faDoorClosed } from '@fortawesome/free-solid-svg-icons';
import 'leaflet/dist/leaflet.css';
import locationIcon from '/location.png'; // Custom icon

// Create a custom icon
const customMarkerIcon = new LeafLet.Icon({
  iconUrl: locationIcon,
  iconRetinaUrl: locationIcon,
  iconSize: [38, 38], // Adjust the size of your icon as needed
  iconAnchor: [22, 38], // Position of the icon's anchor (tail of the marker)
  popupAnchor: [-3, -38], // Position of the popup relative to the icon
  shadowUrl: null, // If you don't want a shadow, set this to null
  shadowSize: null,
  shadowAnchor: null,
});

const MyMap = ({ hours }) => {
  return (
    <MapContainer center={[21.4892, 70.077]} zoom={13} style={{ height: '50vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[21.4892, 70.077]} icon={customMarkerIcon}>
        <Popup>
          Our Office. {hours > 10 && hours < 18 ? (
            <FontAwesomeIcon icon={faDoorOpen} className='text-green-500' />
          ) : (
            <FontAwesomeIcon icon={faDoorClosed} className='text-red-500' />
          )}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MyMap;
