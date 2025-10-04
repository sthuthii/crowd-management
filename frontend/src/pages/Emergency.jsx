import React, { useState, useEffect } from 'react';
import { createEmergency, getActiveEmergencies } from '../services/api';

const Emergency = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [sosLoading, setSosLoading] = useState(false);
    const [error, setError] = useState('');
    const [alertSent, setAlertSent] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [myAlertId, setMyAlertId] = useState(null);

    // We still fetch all emergencies in the background to get status updates for our own alert
    useEffect(() => {
        const fetchEmergencies = async () => {
            try {
                const response = await getActiveEmergencies();
                setEmergencies(response.data);
            } catch (err) {
                console.error("Failed to fetch emergencies for status check", err);
            }
        };

        fetchEmergencies();
        const interval = setInterval(fetchEmergencies, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleSosClick = () => {
        setShowModal(true);
        setAlertSent(false);
        setMyAlertId(null);
    };

   
const handleEmergencySelect = async (emergencyType) => {
    setSosLoading(true);
    setError('');
    setShowModal(false);

    // This function will be called after getting the location
    const sendSos = async (latitude, longitude) => {
        const emergencyData = {
            user_id: `devotee_${Date.now()}`,
            latitude: latitude,
            longitude: longitude,
            emergency_type: emergencyType
        };

        try {
            const response = await createEmergency(emergencyData);
            setAlertSent(true);
            setMyAlertId(response.data.id);
            setEmergencies(prev => [response.data, ...prev]);
        } catch (err) {
            setError('Failed to send SOS. Please try again.');
            console.error(err);
        } finally {
            setSosLoading(false);
        }
    };

    // --- NEW: Use the Geolocation API ---
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success: We got the real location
                sendSos(position.coords.latitude, position.coords.longitude);
            },
            () => {
                // Error/Denied: Fallback to the mock location
                setError("Could not get location. Sending with default coordinates.");
                sendSos(20.9517, 70.3979); // Default mock location
            }
        );
    } else {
        // Geolocation not supported by browser
        setError("Geolocation is not supported by your browser. Sending with default coordinates.");
        sendSos(20.9517, 70.3979); // Default mock location
    }
};



    const myAlert = emergencies.find(e => e.id === myAlertId);

    return (
        <>
            {showModal && (
                 <div className="modal-overlay">
                    <div className="modal-content text-center">
                        <h4>Select Emergency Type</h4>
                        <button className="btn btn-warning btn-lg w-100 mb-2" onClick={() => handleEmergencySelect('Medical')}>Medical</button>
                        <button className="btn btn-info btn-lg w-100 mb-2" onClick={() => handleEmergencySelect('Lost Child')}>Lost Child</button>
                        <button className="btn btn-secondary btn-lg w-100" onClick={() => handleEmergencySelect('Security')}>Security</button>
                        <hr />
                        <button className="btn btn-light w-100" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="card text-center p-4 shadow-lg">
                <h2 className="text-danger">Emergency SOS</h2>
                <p>If you are in distress, press the button below for immediate assistance.</p>
                <button
                    className="btn btn-danger btn-lg p-4 rounded-circle"
                    onClick={handleSosClick}
                    disabled={sosLoading}
                    style={{ fontSize: '2rem', width: '150px', height: '150px', margin: 'auto' }}
                >
                    {sosLoading ? 'SENDING...' : 'SOS'}
                </button>
                
                {alertSent && myAlert && (
                    <div className="alert alert-success mt-3">
                        Help is on the way! Your alert for **{myAlert.emergency_type}** has been sent.
                        <hr/>
                        <strong>Current Status:</strong> {myAlert.status.toUpperCase()}
                    </div>
                )}
                
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </>
    );
};

export default Emergency;