import React, { useState, useEffect } from 'react';
import { getActiveAlerts } from '../services/api';

const AlertsDisplay = () => {
    const [alerts, setAlerts] = useState([]);
    const [dismissedAlertIds, setDismissedAlertIds] = useState(() => {
        const saved = sessionStorage.getItem('dismissedAlerts');
        return saved ? JSON.parse(saved) : [];
    });
    const [dismissedCriticalId, setDismissedCriticalId] = useState(
        () => sessionStorage.getItem('dismissedCriticalId') || null
    );

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await getActiveAlerts();
                const newAlerts = response.data;
                setAlerts(newAlerts);

                // Check if a new, undismissed critical alert has arrived
                const newCritical = newAlerts.find(a => a.severity === 'critical');
                if (newCritical && newCritical.id.toString() !== dismissedCriticalId) {
                    // This will make the modal reappear if a NEW critical alert is sent
                    sessionStorage.removeItem('dismissedCriticalId');
                    setDismissedCriticalId(null);
                }
            } catch (error) {
                console.error("Failed to fetch alerts:", error);
            }
        };

        fetchAlerts();
        const interval = setInterval(fetchAlerts, 15000);
        return () => clearInterval(interval);
    }, [dismissedCriticalId]); // Re-run effect if dismissedCriticalId changes

    const handleDismissNormal = (alertId) => {
        const newDismissedIds = [...dismissedAlertIds, alertId];
        setDismissedAlertIds(newDismissedIds);
        sessionStorage.setItem('dismissedAlerts', JSON.stringify(newDismissedIds));
    };

    // --- MODIFIED: Ensure we always work with strings ---
    const handleDismissCritical = (alertId) => {
        const idAsString = alertId.toString();
        setDismissedCriticalId(idAsString);
        sessionStorage.setItem('dismissedCriticalId', idAsString);
    };

    const criticalAlert = alerts.find(alert => alert.severity === 'critical');
    const normalAlerts = alerts.filter(alert => 
        alert.severity !== 'critical' && !dismissedAlertIds.includes(alert.id)
    );

    const renderCriticalAlert = () => {
        if (criticalAlert && criticalAlert.id.toString() !== dismissedCriticalId) {
            return (
                <div className="critical-alert-overlay">
                    <div className="critical-alert-content text-center">
                        <h2 className="text-danger">CRITICAL INCIDENT ALERT</h2>
                        <p className="fs-5 mt-3">{criticalAlert.message}</p>
                        <p>Please remain calm and follow all instructions from temple staff and authorities.</p>
                        <button 
                            className="btn btn-primary mt-3" 
                            onClick={() => handleDismissCritical(criticalAlert.id)}
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            {renderCriticalAlert()}
            <div className="container mt-3">
                {normalAlerts.map(alert => (
                    <div key={alert.id} className={`alert ${alert.severity === 'warning' ? 'alert-warning' : 'alert-info'} alert-dismissible fade show`} role="alert">
                        <strong>ALERT:</strong> {alert.message}
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => handleDismissNormal(alert.id)}
                            aria-label="Close"
                        ></button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default AlertsDisplay;