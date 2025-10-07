import React from "react";
import useQueues from "../hooks/useQueues";

// Helper function to determine the status color and text based on queue length
const getQueueStatus = (normal, priority) => {
  const total = normal + priority;
  if (total > 10) {
    return { text: "Very Busy", color: "#e53935" }; // Red
  }
  if (total > 5) {
    return { text: "Busy", color: "#fdd835" }; // Yellow
  }
  return { text: "Not Busy", color: "#43a047" }; // Green
};

// Helper function to calculate an estimated wait time (in minutes)
const getWaitTime = (normal, priority) => {
  // A simple estimation logic: 1.5 mins for each person in the normal queue
  // and 1 min for each person in the priority queue.
  const wait = Math.round(normal * 1.5 + priority * 1);
  return wait > 0 ? `~${wait} min` : "No Wait";
};

export default function QueueDashboard({ language }) {
  const { queues, joinQueue, serveNext, loading, error } = useQueues(language);

  if (loading)
    return <p style={{ textAlign: "center", fontSize: 18 }}>Loading queue information...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", fontSize: 18 }}>{error}</p>
    );
  if (!Object.keys(queues).length)
    return (
      <p style={{ textAlign: "center", fontSize: 18 }}>No queue data is currently available.</p>
    );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Live Queue Status</h1>

      <div style={styles.grid}>
        {Object.entries(queues).map(([location, counts]) => {
          const status = getQueueStatus(counts.normal, counts.priority);
          const waitTime = getWaitTime(counts.normal, counts.priority);
          
          return (
            <div key={location} style={styles.card}>
              <div style={{ ...styles.cardHeader, backgroundColor: status.color }}>
                <h3 style={styles.locationTitle}>{location}</h3>
                <span style={styles.statusBadge}>{status.text}</span>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>👨‍👩‍👧‍👦 Normal Queue:</span>
                  <span style={styles.infoValue}>{counts.normal} people</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>⭐ Priority Queue:</span>
                  <span style={styles.infoValue}>{counts.priority} people</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>⏳ Est. Wait Time:</span>
                  <span style={styles.infoValue}>{waitTime}</span>
                </div>
              </div>
              {/* Optional: Add admin controls back if needed */}
              {/* <div style={styles.cardFooter}>
                <button onClick={() => joinQueue(location, "normal")}>Join Normal</button>
                <button onClick={() => serveNext(location, "normal")}>Serve Next</button>
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Styles ---
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    backgroundColor: "#f4f7f9",
  },
  title: {
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "transform 0.2s",
  },
  cardHeader: {
    padding: "15px 20px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationTitle: {
    margin: 0,
    fontSize: "1.25rem",
  },
  statusBadge: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  cardBody: {
    padding: "20px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    fontSize: "1rem",
  },
  infoLabel: {
    color: "#555",
  },
  infoValue: {
    color: "#333",
    fontWeight: "bold",
  },
};