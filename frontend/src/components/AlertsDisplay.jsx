import React, { useState, useEffect } from 'react';
import { getActiveAlerts } from '../services/api';

const AlertsDisplay = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await getActiveAlerts();
                setAlerts(response.data);
            } catch (error) {
                console.error("Failed to fetch alerts:", error);
            }
        };

        fetchAlerts(); // Fetch immediately on load
        const interval = setInterval(fetchAlerts, 20000); // And then every 20 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    if (alerts.length === 0) {
        return null; // Don't show anything if there are no alerts
    }

    // Helper to get the right Bootstrap class for the severity
    const getAlertClass = (severity) => {
        if (severity === 'critical') return 'alert-danger';
        if (severity === 'warning') return 'alert-warning';
        return 'alert-info';
    };

    return (
        <div className="container mt-3">
            {alerts.map(alert => (
                <div key={alert.id} className={`alert ${getAlertClass(alert.severity)}`} role="alert">
                    <strong>ALERT:</strong> {alert.message}
                </div>
            ))}
        </div>
    );
};

export default AlertsDisplay;