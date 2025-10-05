import React, { useState, useEffect } from 'react';
import { getActiveEmergencies, updateEmergency, createAlert, getCrowdPrediction } from '../services/api';
import EmergencyMap from '../components/EmergencyMap';

// Helper function for the forecast badge color
const getStatusColor = (prediction) => {
    switch (prediction?.toLowerCase()) {
        case 'low': return 'bg-success';
        case 'medium': return 'bg-warning';
        case 'high': return 'bg-danger';
        default: return 'bg-secondary';
    }
};

// Sub-component for the list of emergencies
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

// Sub-component for the alert creation form
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
            <div className="card-header"><h4>Send a New Broadcast Alert</h4></div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">Alert Message</label>
                        <textarea id="message" className="form-control" rows="3" value={message} onChange={(e) => setMessage(e.target.value)} required ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="severity" className="form-label">Severity</label>
                        <select id="severity" className="form-select" value={severity} onChange={(e) => setSeverity(e.target.value)} >
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
}

// The main Admin page component that combines everything
const Admin = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [prediction, setPrediction] = useState('Loading...');

    useEffect(() => {
        const fetchEmergencies = async () => {
            try {
                const response = await getActiveEmergencies();
                setEmergencies(response.data);
            } catch (error) {
                console.error("Failed to fetch emergencies", error);
            } finally {
                if (isLoading) setIsLoading(false);
            }
        };
        fetchEmergencies();
        const interval = setInterval(fetchEmergencies, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getCrowdPrediction()
            .then(response => setPrediction(response.data.prediction))
            .catch(err => setPrediction('Unavailable'));
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateEmergency(id, { status: newStatus });
            // The list will update on the next interval
        } catch (err) {
            console.error('Failed to update status.');
        }
    };

    return (
        <div>
            <h2 className="mb-4">Admin Control Panel</h2>
            <div className="card mb-4">
                <div className="card-header">Crowd Forecast</div>
                <div className="card-body text-center">
                    <h5>Predicted Crowd Level Now:</h5>
                    <span className={`badge fs-4 ${getStatusColor(prediction)}`}>
                        {prediction}
                    </span>
                </div>
            </div>
            <AlertsForm />
            <EmergencyMap emergencies={emergencies} />
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

export default Admin;