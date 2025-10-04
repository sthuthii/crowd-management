import React, { useState, useEffect } from 'react';

import { getActiveEmergencies, updateEmergency, createAlert } from '../services/api';
import EmergencyMap from '../components/EmergencyMap';

import EmergencyDashboard from '../components/EmergencyDashboard'; // <-- Import the dashboard


const EmergencyList = ({ emergencies, onUpdateStatus }) => {
    return (
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
                            <button className="btn btn-primary btn-sm" onClick={() => onUpdateStatus(emergency.id, 'dispatched')}>Dispatch</button>
                            <button className="btn btn-success btn-sm" onClick={() => onUpdateStatus(emergency.id, 'resolved')}>Resolve</button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};


const Admin = () => {
    // --- State is now managed here in the parent component ---
    const [emergencies, setEmergencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEmergencies = async () => {
        try {
            const response = await getActiveEmergencies();
            setEmergencies(response.data);
        } catch (error) {
            console.error("Failed to fetch emergencies", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmergencies();
        const interval = setInterval(fetchEmergencies, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateEmergency(id, { status: newStatus });
            fetchEmergencies(); // Manually refresh after update
        } catch (err) {
            console.error('Failed to update status.');
        }
    };

    return (
        <div>
            <h2 className="mb-4">Admin Control Panel</h2>
            <AlertsForm />
            <EmergencyMap emergencies={emergencies} /> {/* <-- Add the Map component */}
            <div className="card mt-4">
                <div className="card-header">
                    <h3>Active Emergency Alerts (List)</h3>
                </div>
                <div className="card-body">
                    {isLoading ? <p>Loading alerts...</p> : <EmergencyList emergencies={emergencies} onUpdateStatus={handleUpdateStatus} />}
                </div>
            </div>
        </div>
    );
};

// We'll keep the form as a sub-component for good organization
const AlertsForm = () => {
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('info');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFeedback({ type: '', message: '' });

        try {
            await createAlert({ message, severity });
            setFeedback({ type: 'success', message: 'Alert sent successfully!' });
            setMessage('');
        } catch (error) {
            setFeedback({ type: 'danger', message: 'Failed to send alert. Please try again.' });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h4>Send a New Broadcast Alert</h4>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">Alert Message</label>
                        <textarea
                            id="message"
                            className="form-control"
                            rows="3"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="severity" className="form-label">Severity</label>
                        <select
                            id="severity"
                            className="form-select"
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value)}
                        >
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Alert'}
                    </button>
                </form>
                {feedback.message && (
                    <div className={`alert alert-${feedback.type} mt-3`}>
                        {feedback.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;