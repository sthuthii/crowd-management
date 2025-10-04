import React, { useState } from 'react';
import { getNearbyExits } from '../services/api';

const EvacuationPage = () => {
    const [exits, setExits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const findExits = () => {
        setIsLoading(true);
        setError('');
        setExits([]);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const response = await getNearbyExits(position.coords.latitude, position.coords.longitude);
                    setExits(response.data);
                } catch (err) {
                    setError(err.response?.data?.detail || "Could not find exits for your location.");
                } finally {
                    setIsLoading(false);
                }
            },
            () => {
                setError("Unable to retrieve your location. Please enable location services.");
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