import React, { useState, useEffect } from 'react';
import { getActiveEmergencies, updateEmergency } from '../services/api';

const EmergencyDashboard = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEmergencies = async () => {
            // No need to set loading to true here, as the interval runs in the background
            try {
                const response = await getActiveEmergencies();
                setEmergencies(response.data);
            } catch (error) {
                console.error("Failed to fetch emergencies", error);
            } finally {
                // Only set loading to false on the initial fetch
                if (isLoading) setIsLoading(false);
            }
        };

        fetchEmergencies();
        const interval = setInterval(fetchEmergencies, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateEmergency(id, { status: newStatus });
            // The list will refresh on the next interval
        } catch (err) {
            console.error('Failed to update status.');
        }
    };

    return (
        <div className="card mt-4">
            <div className="card-header">
                <h3>Active Emergency Alerts</h3>
            </div>
            <div className="card-body">
                {isLoading ? <p>Loading alerts...</p> : (
                    <ul className="list-group">
                        {emergencies.length === 0 && <li className="list-group-item">No active emergencies.</li>}
                        {emergencies.map(emergency => (
                            <li key={emergency.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{emergency.emergency_type}</strong> (ID: {emergency.id})<br />
                                    <small>User: {emergency.user_id} @ {new Date(emergency.timestamp).toLocaleTimeString()}</small>
                                </div>
                                <div>
                                    <span className="badge bg-warning me-3">{emergency.status.toUpperCase()}</span>
                                    <div className="btn-group">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(emergency.id, 'dispatched')}>Dispatch</button>
                                        <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(emergency.id, 'resolved')}>Resolve</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EmergencyDashboard;