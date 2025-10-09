import React, { useEffect, useState } from "react";
import TrafficFlow from "../components/TrafficFlow";
import CrowdStats from "../components/CrowdStats";
import api from "../services/api";

export default function Dashboard() {
  const [accessibility, setAccessibility] = useState({});
  const [emergency, setEmergency] = useState({});
  const [queueData, setQueueData] = useState({});
  const [queueError, setQueueError] = useState("");

  const fetchQueue = async () => {
    try {
      const resp = await fetch("/queue");
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
      const resp = await api.get("/emergency/status");
      setEmergency(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueue();
    fetchAccessibility();
    fetchEmergency();

    const interval = setInterval(() => {
      fetchQueue();
      fetchAccessibility();
      fetchEmergency();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Temple Crowd Management Dashboard</h1>

      <div style={styles.grid}>
        {/* ✅ Queue Overview */}
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

        {/* ✅ Traffic Overview */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Traffic Overview</h2>
          <TrafficFlow />
        </div>

        {/* ✅ Crowd Overview */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Crowd Overview</h2>
          <CrowdStats />
        </div>

        {/* ✅ Accessibility Info */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Accessibility Information</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Ramps</th>
                  <th>Priority Entrance</th>
                  <th>Accessible Restroom</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(accessibility).map((loc) => (
                  <tr key={loc}>
                    <td>{loc}</td>
                    <td>{accessibility[loc]?.ramps ? "Yes" : "No"}</td>
                    <td>
                      {accessibility[loc]?.priority_entrance ? "Yes" : "No"}
                    </td>
                    <td>
                      {accessibility[loc]?.accessible !== undefined
                        ? accessibility[loc].accessible
                          ? "Yes"
                          : "No"
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ Emergency Status */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Emergency Status</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(emergency).map((loc) => (
                  <tr key={loc}>
                    <td>{loc}</td>
                    <td>{emergency[loc]}</td>
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
  },
};
