import React, { useState, useEffect, useRef } from "react";
import {
  createEmergency,
  getActiveEmergencies,
} from "../services/api";
import api from "../services/api";

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

  // Fetch admin status
  const fetchStatus = async () => {
    try {
      const resp = await api.get("/emergency/status");
      const newStatus = resp.data;
      setStatus(newStatus);

      // Announce changes
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

  // Fetch emergency list
  const fetchEmergencies = async () => {
    try {
      const resp = await getActiveEmergencies();
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => sendSOS(type, pos.coords.latitude, pos.coords.longitude),
        () => sendSOS(type, 20.913, 70.363)
      );
    } else sendSOS(type, 20.913, 70.363);
  };

  const sendSOS = async (type, lat, lon) => {
    const data = {
      user_id: `devotee_${Date.now()}`,
      latitude: lat,
      longitude: lon,
      emergency_type: type,
    };
    try {
      const resp = await createEmergency(data);
      setAlertSent(true);
      setMyAlertId(resp.data.id);
      setEmergencies((prev) => [resp.data, ...prev]);
    } catch (err) {
      setError("Failed to send SOS. Try again.");
    } finally {
      setSosLoading(false);
    }
  };

  // 🔊 Audio + Speech
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

  const statusColors = {
    Safe: "#d9f7be",
    Alert: "#fff566",
    Critical: "#ff7875",
  };

  const myAlert = emergencies.find((e) => e.id === myAlertId);

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>🚨 Emergency Management</h2>

      {/* SOS Button */}
      <div style={styles.sosCard}>
        <h3>Need Help?</h3>
        <p>Press SOS to send an emergency alert with your location.</p>
        <button
          style={styles.sosButton}
          onClick={handleSosClick}
          disabled={sosLoading}
        >
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

      {/* Modal */}
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

      {/* Admin Table */}
      <table style={styles.table}>
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
              <td style={{ backgroundColor: statusColors[status[loc]] || "#d9f7be" }}>
                {status[loc] || "Safe"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  sosCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    marginBottom: "40px",
  },
  sosButton: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "130px",
    height: "130px",
    fontSize: "2rem",
    cursor: "pointer",
    margin: "20px auto",
    display: "block",
  },
  successMsg: {
    backgroundColor: "#d4edda",
    padding: "10px",
    borderRadius: "8px",
    color: "#155724",
  },
  errorMsg: {
    backgroundColor: "#f8d7da",
    padding: "10px",
    borderRadius: "8px",
    color: "#721c24",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100%", height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 1000,
  },
  modalBox: {
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    width: "350px",
    textAlign: "center",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    margin: "15px 0",
  },
  optionBtn: {
    padding: "10px",
    border: "1px solid #ddd",
    background: "#f5f5f5",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "8px 15px",
    border: "none",
    background: "#ccc",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
  },
};
