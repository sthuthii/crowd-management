import React, { useState, useEffect } from "react";
import api from "../services/api";

// Hardcoded shuttle locations
const shuttleLocations = [
  "Parking Lot Entrance",
  "Main Temple Gate",
  "Cafeteria",
  "North Gate",
  "South Gate"
];

export default function Traffic() {
  const [parking, setParking] = useState({});
  const [shuttles, setShuttles] = useState([]);
  const [advisory, setAdvisory] = useState({});

  const fetchTraffic = async () => {
    try {
      const [parkingResp, shuttlesResp, advisoryResp] = await Promise.all([
        api.get("/traffic/parking"),
        api.get("/traffic/shuttle"),
        api.get("/traffic/traffic-advisory")
      ]);

      setParking(parkingResp.data);
      setShuttles(shuttlesResp.data);
      setAdvisory(advisoryResp.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTraffic();
    const interval = setInterval(fetchTraffic, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  const getAdvisoryColor = (code) => {
    if (code === "RED") return "#ff4d4d";
    if (code === "YELLOW") return "#ffcc00";
    return "#4caf50"; // green
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Temple Traffic Dashboard</h1>

      {/* Parking */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Parking Recommendation</h2>
        <div style={styles.card}>
          {parking.recommended_level ? (
            <>
              <p style={styles.cardText}>
                <strong>Recommended Level:</strong> {parking.recommended_level}
              </p>
              <p style={styles.cardText}>
                <strong>Available Slots:</strong> {parking.overall_available_slots}
              </p>
            </>
          ) : (
            <p>Loading parking info...</p>
          )}
        </div>
      </div>

      {/* Shuttle Info */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Shuttle Status</h2>
        <div style={styles.card}>
          {shuttles.length === 0 ? (
            <p>No shuttle data available.</p>
          ) : (
            shuttles.map((s, idx) => (
              <p key={s.id} style={styles.cardText}>
                <strong>{s.id}</strong>: {s.occupied} passengers onboard, near{" "}
                <span style={{ fontStyle: "italic" }}>
                  {shuttleLocations[idx % shuttleLocations.length]}
                </span>
              </p>
            ))
          )}
        </div>
      </div>

      {/* Traffic Advisory */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Crowd & Traffic Advisory</h2>
        <div
          style={{
            ...styles.advisoryCard,
            backgroundColor: getAdvisoryColor(advisory.action_code),
            color: advisory.action_code === "YELLOW" ? "#000" : "#fff"
          }}
        >
          <p style={styles.advisoryText}>
            <strong>Status:</strong> {advisory.severity || "Loading..."}
          </p>
          <p style={styles.advisoryText}>{advisory.advisory_message || ""}</p>
        </div>
      </div>

      <p style={styles.footerText}>
        🔄 Dashboard updates every 5 seconds to help you plan your visit.
      </p>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    maxWidth: "95%",
    margin: "0 auto",
    backgroundColor: "#fefefe",
  },
  title: {
    textAlign: "center",
    marginBottom: "40px",
    color: "#333",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  section: {
    marginBottom: "30px",
  },
  sectionTitle: {
    marginBottom: "12px",
    color: "#555",
    fontSize: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap"
  },
  card: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    lineHeight: "1.7",
    transition: "transform 0.2s",
    fontSize: "1rem",
    wordBreak: "break-word"
  },
  cardText: {
    margin: "6px 0",
  },
  advisoryCard: {
    padding: "20px",
    borderRadius: "15px",
    fontWeight: "bold",
    lineHeight: "1.6",
    textAlign: "center",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    fontSize: "1rem",
  },
  advisoryText: {
    margin: "6px 0",
  },
  footerText: {
    textAlign: "center",
    marginTop: "30px",
    color: "#777",
    fontSize: "0.9rem",
  },
  // Responsive adjustments
  "@media (max-width: 768px)": {
    title: { fontSize: "1.6rem" },
    sectionTitle: { fontSize: "1.3rem" },
    card: { fontSize: "0.95rem", padding: "12px" },
    advisoryCard: { fontSize: "0.95rem", padding: "15px" }
  },
  "@media (max-width: 480px)": {
    title: { fontSize: "1.4rem" },
    sectionTitle: { fontSize: "1.2rem" },
    card: { fontSize: "0.9rem", padding: "10px" },
    advisoryCard: { fontSize: "0.9rem", padding: "12px" }
  }
};
