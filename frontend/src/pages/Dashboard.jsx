import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import TrafficFlow from "../components/TrafficFlow";
import CrowdStats from "../components/CrowdStats";
import api from "../services/api";

export default function Dashboard() {
  const [accessibility, setAccessibility] = useState({});
  const [emergency, setEmergency] = useState([]);
  const [queueData, setQueueData] = useState({});
  const [traffic, setTraffic] = useState({});
  const [queueError, setQueueError] = useState("");
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const fetchQueue = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:8000/queue");
      if (!resp.ok) throw new Error("Failed to fetch queue data");
      const data = await resp.json();
      setQueueData(data);
      setQueueError("");
    } catch (err) {
      console.error(err);
      setQueueError("Failed to fetch queue data. Please check backend.");
    }
  };

  const fetchAccessibility = async () => {
    try {
      const resp = await api.get("/accessibility/accessibility");
      setAccessibility(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmergency = async () => {
    try {
      const resp = await api.get("/api/emergency/");
      setEmergency(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTraffic = async () => {
    try {
      const resp = await api.get("/traffic-advisory");
      setTraffic(resp.data.live_data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueue();
    fetchAccessibility();
    fetchEmergency();
    fetchTraffic();

    const interval = setInterval(() => {
      fetchQueue();
      fetchAccessibility();
      fetchEmergency();
      fetchTraffic();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  // 3. New handler to navigate to the accessibility page with state
  const handleGuideClick = (locationName) => {
    let targetLocation = locationName;
    if (locationName === "Main Hall") targetLocation = "Darshan Queue Entrance";
    if (locationName === "Temple Gate") targetLocation = "Main Gate";
    
    navigate('/accessibility', { state: { location: targetLocation } });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Temple Crowd Management Dashboard</h1>

      <div style={styles.grid}>
        {/* Queue Overview */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Queue Overview</h2>
          {queueError ? (
            <p style={{ color: "red" }}>{queueError}</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Normal Queue</th>
                    <th>Priority Queue</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(queueData).map((loc) => (
                    <tr key={loc}>
                      <td>{loc}</td>
                      <td>{queueData[loc].normal}</td>
                      <td>{queueData[loc].priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Traffic Overview */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Traffic Overview</h2>
          <TrafficFlow traffic={traffic} />
        </div>

        {/* Crowd Overview */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Crowd Overview</h2>
          <CrowdStats />
        </div>

        {/* ✅ 4. Replaced the old Accessibility section with the new interactive one */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Accessibility & Special Assistance</h2>
          <p style={{ color: "#666", marginBottom: "15px" }}>
            Click "Get Guide" to see the location on the map and hear audio instructions.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Facility Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(accessibility).map((loc) => (
                  <tr key={loc}>
                    <td><strong>{loc}</strong></td>
                    <td>
                      {accessibility[loc]?.ramps && "Ramp Available. "}
                      {accessibility[loc]?.priority_entrance && "Priority Line. "}
                      {accessibility[loc]?.accessible && "Accessible Restroom. "}
                    </td>
                    <td>
                      <button 
                        style={styles.guideButton} 
                        onClick={() => handleGuideClick(loc)}
                      >
                        Get Guide
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Emergency Status */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Emergency Status</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Emergency Type</th>
                  <th>Current Status</th>
                </tr>
              </thead>
              <tbody>
                {emergency.map((item) => (
                  <tr key={item.id}>
                    <td>{item.emergency_type}</td>
                    <td><span style={getEmergencyStatusStyle(item.status)}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to style the emergency status
const getEmergencyStatusStyle = (status) => {
  const colors = {
    reported: "#ffc107",
    dispatched: "#17a2b8",
    resolved: "#28a745",
  };
  return {
    backgroundColor: colors[status.toLowerCase()] || "#6c757d",
    color: "white",
    padding: "3px 8px",
    borderRadius: "5px",
    fontWeight: "bold",
  };
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#2c3e50",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    width: "100%",
    boxSizing: "border-box",
  },
  cardTitle: {
    marginBottom: "15px",
    color: "#34495e",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  // 5. Added the style for the new button
  guideButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};