// frontend/src/pages/Emergency.jsx

import React, { useState, useEffect } from 'react';
import { createEmergency, getActiveEmergencies, updateEmergency } from '../services/api';

const Emergency = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [alertSent, setAlertSent] = useState(false);

    // Fetch active emergencies for the admin dashboard
    const fetchEmergencies = async () => {
        try {
            const response = await getActiveEmergencies();
            setEmergencies(response.data);
        } catch (err) {
            setError('Failed to fetch emergencies.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchEmergencies();
        // Poll for new emergencies every 10 seconds
        const interval = setInterval(fetchEmergencies, 10000);
        return () => clearInterval(interval);
    }, []);

    // Handler for the devotee's SOS button
    const handleSosClick = async () => {
        setLoading(true);
        setAlertSent(false);
        const mockEmergencyData = {
            user_id: `devotee_${Date.now()}`, // Using a mock user/device ID
            latitude: 13.139,  // Mock location data
            longitude: 77.594,
            emergency_type: "Medical"
        };

        try {
            await createEmergency(mockEmergencyData);
            setAlertSent(true);
            // Refresh the list instantly for the admin view
            fetchEmergencies();
        } catch (err) {
            setError('Failed to send SOS. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handler for admin to update an emergency status
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateEmergency(id, { status: newStatus });
            // Refresh list to reflect the change
            fetchEmergencies();
        } catch (err) {
            setError('Failed to update status.');
            console.error(err);
        }
    };

    return (
        <div className="container mt-4">
            {/* Section 1: Devotee View */}
            <div className="card text-center p-4 mb-5 shadow-lg">
                <h2 className="text-danger">Emergency SOS</h2>
                <p>If you are in distress, press the button below for immediate assistance.</p>
                <button
                    className="btn btn-danger btn-lg p-4 rounded-circle"
                    onClick={handleSosClick}
                    disabled={loading}
                    style={{ fontSize: '2rem', width: '150px', height: '150px', margin: 'auto' }}
                >
                    {loading ? 'SENDING...' : 'SOS'}
                </button>
                {alertSent && <div className="alert alert-success mt-3">Help is on the way!</div>}
            </div>

            {/* Section 2: Admin Dashboard View */}
            <div className="card">
                <div className="card-header">
                    <h3>Active Emergency Alerts</h3>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <ul className="list-group">
                        {emergencies.length > 0 ? emergencies.map(emergency => (
                            <li key={emergency.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>ID: {emergency.id}</strong> ({emergency.emergency_type})
                                    <br />
                                    <small>User: {emergency.user_id} at {new Date(emergency.timestamp).toLocaleTimeString()}</small>
                                    <br/>
                                    <small>Location: [{emergency.latitude}, {emergency.longitude}]</small>
                                </div>
                                <div>
                                    <span className={`badge bg-warning me-3`}>{emergency.status.toUpperCase()}</span>
                                    <div className="btn-group">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(emergency.id, 'dispatched')}>Dispatch</button>
                                        <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(emergency.id, 'resolved')}>Resolve</button>
                                    </div>
                                </div>
                            </li>
                        )) : (
                            <li className="list-group-item">No active emergencies.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Emergency;