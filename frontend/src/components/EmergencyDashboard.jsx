
import React, { useState, useEffect } from 'react';
import { getActiveEmergencies, updateEmergency } from '../services/api';
import './EmergencyDashboard.css'; 

const EmergencyDashboard = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    
    return (
        <div className="admin-dashboard-card">
            <div className="admin-dashboard-header">
                <h3>Active Emergency Alerts</h3>
            </div>
            {isLoading ? <p className="loading-text">Loading alerts...</p> : (
                <ul className="alert-list">
                    {emergencies.length === 0 && <li className="alert-item">No active emergencies.</li>}
                    {emergencies.map(emergency => (
                        <li key={emergency.id} className="alert-item">
                            <div className="alert-info">
                                <strong>{emergency.emergency_type}</strong> (ID: {emergency.id})<br />
                                <small>User: {emergency.user_id} @ {new Date(emergency.timestamp).toLocaleTimeString()}</small>
                            </div>
                            <div className="alert-actions">
                                <span className="status-badge">{emergency.status.toUpperCase()}</span>
                                <div className="btn-group">
                                    <button className="btn btn-blue btn-sm" onClick={() => handleUpdateStatus(emergency.id, 'dispatched')}>Dispatch</button>
                                    <button className="btn btn-green btn-sm" onClick={() => handleUpdateStatus(emergency.id, 'resolved')}>Resolve</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EmergencyDashboard;