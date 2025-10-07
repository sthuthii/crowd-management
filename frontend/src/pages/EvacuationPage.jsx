import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { getNearbyExits } from '../services/api';
import { speak } from '../services/tts'; // Import the text-to-speech service

const mapContainerStyle = {
  height: '500px',
  width: '100%',
};

// URL for a custom blue marker icon for the user's location
const userIconUrl = "http://maps.google.com/mapfiles/ms/icons/";

// Helper function to calculate distance between two coordinates (Haversine formula)
const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
};


const EvacuationPage = () => {
    const [exits, setExits] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [nearestExit, setNearestExit] = useState(null);
    const [directions, setDirections] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const findExits = async () => {
        setIsLoading(true);
        setError('');
        setExits([]);
        setUserLocation(null);
        setNearestExit(null);
        setDirections(null);

        // --- THIS IS THE FIX ---
        // We are using a MOCKED location inside the Somnath temple zone for testing.
        const mockLatitude = 20.8881;
        const mockLongitude = 70.4014;
        
        const currentUserLocation = { lat: mockLatitude, lng: mockLongitude };
        setUserLocation(currentUserLocation);

        try {
            const response = await getNearbyExits(mockLatitude, mockLongitude);
            const fetchedExits = response.data;
            
            if (fetchedExits.length > 0) {
                let closestExit = fetchedExits[0];
                let minDistance = getDistanceInMeters(mockLatitude, mockLongitude, closestExit.latitude, closestExit.longitude);

                fetchedExits.forEach(exit => {
                    const distance = getDistanceInMeters(mockLatitude, mockLongitude, exit.latitude, exit.longitude);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestExit = exit;
                    }
                });
                
                setNearestExit(closestExit);
                setExits(fetchedExits);
                
                // Announce the nearest exit via audio
                speak(`Emergency. The nearest exit is ${closestExit.name}. Please follow the path shown on the map.`);
            } else {
                setError("No exits found for the simulated location.");
            }

        } catch (err) {
            setError(err.response?.data?.detail || "Could not find exits for your location.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const directionsCallback = (response) => {
        if (response !== null) {
            if (response.status === 'OK') {
                setDirections(response);
            } else {
                setError('Could not calculate directions. ' + response.status);
            }
        }
    };

    return (
        <div className="card text-center">
            <div className="card-header">
                <h3>Emergency Exit Finder</h3>
            </div>
            <div className="card-body">
                <p>In an emergency, press the button below to find the nearest exits on the map.</p>
                <button className="btn btn-danger btn-lg" onClick={findExits} disabled={isLoading}>
                    {isLoading ? 'Finding nearest exits...' : 'Find Nearest Exits'}
                </button>

                {error && <div className="alert alert-danger mt-3">{error}</div>}
                
                {userLocation && (
                    <div className="mt-4">
                        {nearestExit && !isLoading && (
                            <div className="alert alert-info">
                                <h4>Your nearest exit is: <strong>{nearestExit.name}</strong></h4>
                                <p>Follow the blue path on the map below.</p>
                            </div>
                        )}
                        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={userLocation}
                                zoom={18}
                            >
                                {/* We only need DirectionsService if we have a user location and a nearest exit */}
                                {userLocation && nearestExit && (
                                    <>
                                        <DirectionsService
                                            options={{
                                                destination: { lat: nearestExit.latitude, lng: nearestExit.longitude },
                                                origin: userLocation,
                                                travelMode: 'WALKING'
                                            }}
                                            callback={directionsCallback}
                                        />
                                        {/* This component will render the blue path on the map */}
                                        {directions && (
                                            <DirectionsRenderer options={{ 
                                                directions: directions,
                                                suppressMarkers: true // We will use our own custom markers
                                            }} />
                                        )}
                                        {/* Custom Marker for user's location */}
                                        <Marker 
                                            position={userLocation} 
                                            title={"You are here"}
                                            icon={{ url: userIconUrl }}
                                        />
                                        {/* Custom Markers for all exits */}
                                        {exits.map(exit => (
                                            <Marker
                                                key={exit.name}
                                                position={{ lat: exit.latitude, lng: exit.longitude }}
                                                title={`Exit: ${exit.name}`}
                                            />
                                        ))}
                                    </>
                                )}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvacuationPage;