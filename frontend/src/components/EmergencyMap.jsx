import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- NEW: Import images the Vite way ---
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// --- UPDATED: Fix for the default marker icon ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const EmergencyMap = ({ emergencies }) => {
  const position = [20.913, 70.363]; // Default center for the map

  return (
    <div className="card mt-4">
        <div className="card-header">
            <h3>Live Emergency Map</h3>
        </div>
        <div className="card-body p-0">
            <MapContainer center={position} zoom={15} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {emergencies.map(emergency => (
                    emergency.latitude && emergency.longitude && (
                        <Marker key={emergency.id} position={[emergency.latitude, emergency.longitude]}>
                            <Popup>
                                <strong>Type:</strong> {emergency.emergency_type} <br />
                                <strong>User:</strong> {emergency.user_id} <br />
                                <strong>Status:</strong> {emergency.status}
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    </div>
  );
};

export default EmergencyMap;