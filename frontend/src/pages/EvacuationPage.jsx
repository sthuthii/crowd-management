import React, { useState } from 'react';
import { getNearbyExits } from '../services/api';
import './EvacuationPage.css'; 

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
            (geoError) => {
                setError("Unable to retrieve your location. Please enable location services in your browser/OS.");
                setIsLoading(false);
            }
        );
    };

    return (
        <div className="evacuation-page">
            <div className="evacuation-card">
                <div className="card-header-evac">
                    <h3 className="evacuation-title">Emergency Exit Finder</h3>
                </div>
                <div className="card-body-evac">
                    <p className="evacuation-subtitle">
                        If you are in an emergency, press the button below to find the nearest exits based on your current location.
                    </p>
                    <button className="evacuation-button" onClick={findExits} disabled={isLoading}>
                        {isLoading ? 'Finding Your Location...' : 'Find Nearest Exits'}
                    </button>

                    {error && <div className="evacuation-alert">{error}</div>}
                    
                    {exits.length > 0 && (
                        <div className="results-container">
                            <h4 className="results-header">Proceed immediately to the nearest exit:</h4>
                            <ul className="results-list">
                                {exits.map(exit => (
                                    <li key={exit.name} className="results-list-item">{exit.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EvacuationPage;