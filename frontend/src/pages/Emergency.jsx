import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";

export default function Emergency() {
  const [emergencies, setEmergencies] = useState([]);
  const [sosLoading, setSosLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [alertSent, setAlertSent] = useState(false);
  const [myAlertId, setMyAlertId] = useState(null);
  
  // This function is no longer needed, but we'll keep it for fetching the user's own alert status
  const fetchEmergencies = async () => {
    try {
      const resp = await api.get("/api/emergency/"); 
      setEmergencies(resp.data);
    } catch (err) {
      console.error("Failed to fetch emergencies", err);
    }
  };

  useEffect(() => {
    // Fetch emergencies when the component loads to track our own alert
    fetchEmergencies();
    const interval = setInterval(() => {
      if (myAlertId) {
        fetchEmergencies();
      }
    }, 7000);
    return () => clearInterval(interval);
  }, [myAlertId]); // Only refetch if we have sent an alert

  const handleSosClick = () => {
    setShowModal(true);
    setError("");
  };

  const handleEmergencySelect = async (type) => {
    setSosLoading(true);
    setShowModal(false);

    const sendSOS = async (lat, lon) => {
      const data = {
        user_id: `devotee_${Date.now()}`,
        latitude: lat,
        longitude: lon,
        emergency_type: type,
        status: "Alert",
      };
      try {
        const resp = await api.post("/api/emergency/", data);
        setAlertSent(true);
        setMyAlertId(resp.data.id);
        // Add the new alert to our list
        setEmergencies((prev) => [resp.data, ...prev]);
      } catch (err) {
        setError("Failed to send SOS. Try again.");
      } finally {
        setSosLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => sendSOS(pos.coords.latitude, pos.coords.longitude),
        () => sendSOS(20.913, 70.363) // Fallback coordinates
      );
    } else {
      sendSOS(20.913, 70.363); // Fallback if geolocation is not available
    }
  };
  
  // Find the specific alert this user sent to display its status
  const myAlert = emergencies.find((e) => e.id === myAlertId);

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>🚨 Emergency Management</h2>

      {/* SOS Button Card */}
      <div style={styles.sosCard}>
        <h3>Need Help?</h3>
        <p>Press SOS to send an emergency alert with your location.</p>
        <button style={styles.sosButton} onClick={handleSosClick} disabled={sosLoading}>
          {sosLoading ? "Sending..." : "SOS"}
        </button>
        {alertSent && myAlert && (
          <div style={styles.successMsg}>
            Help is on the way for <b>{myAlert.emergency_type}</b>!<br />
            <small>Status: {myAlert.status}</small>
          </div>
        )}
        {error && <div style={styles.errorMsg}>{error}</div>}
      </div>

      {/* Modal for selecting emergency type */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h4>Select Emergency Type</h4>
            <div style={styles.options}>
              {["Medical", "Lost Child", "Security"].map((type) => (
                <button key={type} style={styles.optionBtn} onClick={() => handleEmergencySelect(type)}>
                  {type}
                </button>
              ))}
            </div>
            <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  sosCard: { background: "#fff", borderRadius: "10px", padding: "25px", textAlign: "center", boxShadow: "0 5px 15px rgba(0,0,0,0.1)", marginBottom: "40px" },
  sosButton: { background: "#e74c3c", color: "#fff", border: "none", borderRadius: "50%", width: "130px", height: "130px", fontSize: "2rem", cursor: "pointer", margin: "20px auto", display: "block" },
  successMsg: { backgroundColor: "#d4edda", padding: "10px", borderRadius: "8px", color: "#155724", marginTop: "15px" },
  errorMsg: { backgroundColor: "#f8d7da", padding: "10px", borderRadius: "8px", color: "#721c24", marginTop: "15px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalBox: { background: "#fff", padding: "25px", borderRadius: "10px", width: "350px", textAlign: "center" },
  options: { display: "flex", flexDirection: "column", gap: "10px", margin: "15px 0" },
  optionBtn: { padding: "10px", border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer" },
  cancelBtn: { padding: "8px 15px", border: "none", background: "#ccc", borderRadius: "5px", cursor: "pointer" },
};