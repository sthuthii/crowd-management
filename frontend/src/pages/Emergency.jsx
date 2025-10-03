// frontend/src/pages/Emergency.jsx

import React, { useState, useEffect } from 'react';
import { createEmergency, getActiveEmergencies, updateEmergency } from '../services/api';
// I'm assuming you have the modal CSS in your main App.css file now
// import './Emergency.css'; 

const Emergency = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [sosLoading, setSosLoading] = useState(false);
    const [error, setError] = useState('');
    const [alertSent, setAlertSent] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [lastSentType, setLastSentType] = useState(''); // State to hold last emergency type

    // --- MODIFIED fetchEmergencies FUNCTION ---
    // It now accepts an argument to decide whether to show the loader
    const fetchEmergencies = async (showLoader = false) => {
        if (showLoader) {
            setListLoading(true);
        }
        setError('');
        try {
            const response = await getActiveEmergencies();
            setEmergencies(response.data);
        } catch (err) {
            setError('Failed to fetch emergencies.');
            console.error(err);
        } finally {
            if (showLoader) {
                setListLoading(false);
            }
        }
    };

    // --- MODIFIED useEffect HOOK ---
    useEffect(() => {
        // Show loader on the very first load
        fetchEmergencies(true);
        
        // Subsequent polls will not show the loader
        const interval = setInterval(() => fetchEmergencies(false), 10000);
        
        return () => clearInterval(interval);
    }, []);

    const handleSosClick = () => {
        setShowModal(true);
        setAlertSent(false);
    };

    const handleEmergencySelect = async (emergencyType) => {
        setSosLoading(true);
        setError('');
        setShowModal(false);

        const mockEmergencyData = {
            user_id: `devotee_${Date.now()}`,
            latitude: 20.9517,
            longitude: 70.3979,
            emergency_type: emergencyType
        };

        try {
            await createEmergency(mockEmergencyData);
            setAlertSent(true);
            setLastSentType(emergencyType); // Save the type for the success message
            // Show loader on this manual refresh
            fetchEmergencies(true);
        } catch (err) {
            setError('Failed to send SOS. Please try again.');
            console.error(err);
        } finally {
            setSosLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateEmergency(id, { status: newStatus });
            fetchEmergencies(false); // No need to show loader for this
        } catch (err) {
            setError('Failed to update status.');
        }
    };

    return (
        <div className="container mt-4">
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

            <div className="card text-center p-4 mb-5 shadow-lg">
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
                {alertSent && <div className="alert alert-success mt-3">Help is on the way! Your alert for **{lastSentType}** has been sent.</div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>

            <div className="card">
                <div className="card-header"><h3>Active Emergency Alerts</h3></div>
                <div className="card-body">
                    {listLoading ? (
                        <p>Loading alerts...</p>
                    ) : (
                        <>
                            {emergencies.length === 0 && <p>No active emergencies.</p>}
                            <ul className="list-group">
                                {emergencies.map(emergency => (
                                    <li key={emergency.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div><strong>ID: {emergency.id}</strong> ({emergency.emergency_type})<br /><small>User: {emergency.user_id} at {new Date(emergency.timestamp).toLocaleTimeString()}</small><br/><small>Location: [{emergency.latitude}, {emergency.longitude}]</small></div>
                                        <div><span className={`badge bg-warning me-3`}>{emergency.status.toUpperCase()}</span><div className="btn-group"><button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(emergency.id, 'dispatched')}>Dispatch</button><button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(emergency.id, 'resolved')}>Resolve</button></div></div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Emergency;