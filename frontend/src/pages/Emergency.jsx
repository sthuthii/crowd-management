import React, { useState, useEffect } from 'react';
import { createEmergency, getActiveEmergencies } from '../services/api';

const Emergency = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [sosLoading, setSosLoading] = useState(false);
    const [error, setError] = useState('');
    const [alertSent, setAlertSent] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [myAlertId, setMyAlertId] = useState(null);

    // Fetch emergencies in the background to get status updates for our own alert
    useEffect(() => {
        const fetchForStatus = async () => {
            try {
                const response = await getActiveEmergencies();
                setEmergencies(response.data);
            } catch (err) {
                console.error("Failed to fetch emergencies for status check", err);
            }
        };

        fetchForStatus(); // Fetch once on load
        const interval = setInterval(fetchForStatus, 10000); // Then poll for updates
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
                // Manually add the new alert to the list for an instant UI update
                setEmergencies(prev => [response.data, ...prev]);
            } catch (err) {
                setError('Failed to send SOS. Please try again.');
                console.error(err);
            } finally {
                setSosLoading(false);
            }
        };

        // Use the Geolocation API to get the user's real location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    sendSos(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    setError("Could not get location. Sending with default coordinates.");
                    sendSos(20.913, 70.363); // Fallback mock location
                }
            );
        } else {
            setError("Geolocation is not supported. Sending with default coordinates.");
            sendSos(20.913, 70.363); // Fallback mock location
        }
    };

    const myAlert = emergencies.find(e => e.id === myAlertId);

    return (
        <>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content text-center">
                        <h4>Select Emergency Type</h4>
                        <div className="emergency-options">
                            <div className="selection-card" onClick={() => handleEmergencySelect('Medical')}>
                                <span className="selection-card-text">Medical</span>
                            </div>
                            <div className="selection-card" onClick={() => handleEmergencySelect('Lost Child')}>
                                <span className="selection-card-text">Lost Child</span>
                            </div>
                            <div className="selection-card" onClick={() => handleEmergencySelect('Security')}>
                                <span className="selection-card-text">Security</span>
                            </div>
                        </div>
                        <hr />
                        <button className="btn btn-light w-100 mt-3" onClick={() => setShowModal(false)}>Cancel</button>
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