import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import './Emergency.css'; 

const locations = ["Main Hall", "Temple Gate", "Cafeteria", "Parking Lot"];

export default function Emergency() {
  const [status, setStatus] = useState({});
  const [emergencies, setEmergencies] = useState([]);
  const [sosLoading, setSosLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [alertSent, setAlertSent] = useState(false);
  const [myAlertId, setMyAlertId] = useState(null);
  const prevStatusRef = useRef({});
  const alertRef = useRef(false);

  

  const fetchStatus = async () => {
    try {
      const resp = await api.get("/api/emergency/");
      const emergenciesData = resp.data;
      const newStatus = {};
      locations.forEach((loc) => {
        const found = emergenciesData.find((e) => e.location === loc);
        newStatus[loc] = found ? found.status : "Safe";
      });
      setStatus(newStatus);
      locations.forEach((loc) => {
        const prev = prevStatusRef.current[loc];
        const curr = newStatus[loc];
        if (prev && prev !== curr) {
          playSound(curr);
          speak(`${loc} is now ${curr}`);
        }
      });
      prevStatusRef.current = newStatus;
    } catch (err) {
      console.error("Error fetching status:", err);
    }
  };

  const fetchEmergencies = async () => {
    try {
      const resp = await api.get("/api/emergency/");
      setEmergencies(resp.data);
    } catch (err) {
      console.error("Failed to fetch emergencies", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchEmergencies();
    const interval = setInterval(() => {
      fetchStatus();
      fetchEmergencies();
    }, 7000);
    return () => clearInterval(interval);
  }, []);

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
        location: locations[0],
        status: "Alert",
      };
      try {
        const resp = await api.post("/api/emergency/", data);
        setAlertSent(true);
        setMyAlertId(resp.data.id);
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
        () => sendSOS(20.913, 70.363)
      );
    } else sendSOS(20.913, 70.363);
  };

  const audioRefs = {
    Safe: new Audio("/sounds/safe.mp3"),
    Alert: new Audio("/sounds/warning.mp3"),
    Critical: new Audio("/sounds/alarm.mp3"),
  };
  const playSound = (level) => {
    const audio = audioRefs[level] || audioRefs["Safe"];
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };
  const speak = (msg) => {
    if ("speechSynthesis" in window && !alertRef.current) {
      alertRef.current = true;
      const utter = new SpeechSynthesisUtterance(msg);
      utter.lang = "en-IN";
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
      utter.onend = () => (alertRef.current = false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Alert": return "status-alert";
      case "Critical": return "status-critical";
      default: return "status-safe";
    }
  };

  const myAlert = emergencies.find((e) => e.id === myAlertId);

  

  return (
    <div className="emergency-page">
      <h1 className="dashboard-title">🚨 Emergency Management</h1>

      <div className="sos-card">
        <h3>Need Help?</h3>
        <p>Press SOS to send an emergency alert with your location.</p>
        <button className="sos-button" onClick={handleSosClick} disabled={sosLoading}>
          {sosLoading ? "..." : "SOS"}
        </button>
        {alertSent && myAlert && (
          <div className="success-message">
            Help is on the way for <b>{myAlert.emergency_type}</b>!<br />
            <small>Status: {myAlert.status}</small>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Select Emergency Type</h4>
            <div className="modal-options">
              {["Medical", "Lost Child", "Security"].map((type) => (
                <button key={type} className="modal-option-btn" onClick={() => handleEmergencySelect(type)}>
                  {type}
                </button>
              ))}
            </div>
            <button className="modal-cancel-btn" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="status-table">
        <thead>
          <tr>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc}>
              <td>{loc}</td>
              <td className={`status-cell ${getStatusClass(status[loc])}`}>
                {status[loc] || "Safe"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}