import React, { useState } from 'react';
import { createAlert } from '../services/api';

const Admin = () => {
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
            setMessage(''); // Clear message on success
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
                <h3>Admin Control Panel</h3>
            </div>
            <div className="card-body">
                <h4>Send a New Broadcast Alert</h4>
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