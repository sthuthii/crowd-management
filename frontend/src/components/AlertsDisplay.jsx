import React, { useState, useEffect } from 'react';
import { getActiveAlerts } from '../services/api';

const AlertsDisplay = () => {
    const [alerts, setAlerts] = useState([]);
    // --- NEW: State to track dismissed alerts, initialized from sessionStorage ---
    const [dismissedAlertIds, setDismissedAlertIds] = useState(() => {
        const saved = sessionStorage.getItem('dismissedAlerts');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await getActiveAlerts();
                setAlerts(response.data);
            } catch (error) {
                console.error("Failed to fetch alerts:", error);
            }
        };

        fetchAlerts();
        const interval = setInterval(fetchAlerts, 20000);

        return () => clearInterval(interval);
    }, []);

    // --- NEW: Function to handle dismissing an alert ---
    const handleDismiss = (alertId) => {
        const newDismissedIds = [...dismissedAlertIds, alertId];
        setDismissedAlertIds(newDismissedIds);
        sessionStorage.setItem('dismissedAlerts', JSON.stringify(newDismissedIds));
    };

    // Filter out critical alerts and already dismissed alerts
    const visibleAlerts = alerts.filter(alert => 
        alert.severity !== 'critical' && !dismissedAlertIds.includes(alert.id)
    );

    // If there's a critical alert, it still takes over the screen
    const criticalAlert = alerts.find(alert => alert.severity === 'critical');
    if (criticalAlert) {
        return (
            <div className="critical-alert-overlay">
                <div className="critical-alert-content">
                    <h1 className="text-danger">CRITICAL ALERT</h1>
                    <p className="fs-4">{criticalAlert.message}</p>
                    <p>Please follow instructions from authorities and move towards the nearest exit calmly.</p>
                </div>
            </div>
        );
    }

    if (visibleAlerts.length === 0) {
        return null;
    }
    
    const getAlertClass = (severity) => {
        if (severity === 'warning') return 'alert-warning';
        return 'alert-info';
    };

    return (
        <div className="container mt-3">
            {visibleAlerts.map(alert => (
                <div key={alert.id} className={`alert ${getAlertClass(alert.severity)} alert-dismissible fade show`} role="alert">
                    <strong>ALERT:</strong> {alert.message}
                    {/* --- NEW: Close Button --- */}
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => handleDismiss(alert.id)}
                        aria-label="Close"
                    ></button>
                </div>
            ))}
        </div>
    );
};

export default AlertsDisplay;