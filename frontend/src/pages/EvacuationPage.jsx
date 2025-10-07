import React, { useState } from 'react';
import { getNearbyExits } from '../services/api';

const EvacuationPage = () => {
    const [exits, setExits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const findExits = () => {
    console.log("1. 'Find Exits' button clicked.");
    setIsLoading(true);
    setError('');
    setExits([]);

    if (!navigator.geolocation) {
        console.error("Error: Geolocation is not supported.");
        setError("Geolocation is not supported by your browser.");
        setIsLoading(false);
        return;
    }

    console.log("2. Asking browser for location...");
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            console.log("3. Success! Location received:", position.coords);
            try {
                const response = await getNearbyExits(position.coords.latitude, position.coords.longitude);
                console.log("4. API call successful. Exits found:", response.data);
                setExits(response.data);
            } catch (err) {
                console.error("5. API call failed:", err);
                setError(err.response?.data?.detail || "Could not find exits for your location.");
            } finally {
                setIsLoading(false);
            }
        },
        (geoError) => {
            console.error("Error getting location:", geoError.message);
            setError("Unable to retrieve your location. Please enable location services in your browser/OS.");
            setIsLoading(false);
        }
    );
};
    return (
        <div className="card text-center">
            <div className="card-header">
                <h3>Emergency Exit Finder</h3>
            </div>
            <div className="card-body">
                <p>If you are in an emergency, press the button below to find the nearest exits based on your current location.</p>
                <button className="btn btn-primary btn-lg" onClick={findExits} disabled={isLoading}>
                    {isLoading ? 'Finding your location...' : 'Find Nearest Exits'}
                </button>

                {error && <div className="alert alert-danger mt-3">{error}</div>}
                
                {exits.length > 0 && (
                    <div className="mt-4">
                        <h4>Go to the nearest exit:</h4>
                        <ul className="list-group">
                            {exits.map(exit => (
                                <li key={exit.name} className="list-group-item fs-4">{exit.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvacuationPage;