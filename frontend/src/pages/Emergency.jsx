import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";

const locations = ["Main Hall", "Temple Gate", "Cafeteria", "Parking Lot"];

export default function Emergency() {
  const [status, setStatus] = useState({});
  const prevStatusRef = useRef({});
  const alertRef = useRef(false); // prevent overlapping speech

  // Fetch status from backend
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
          speak(`${loc} is now ${curr} (${getColorName(curr)})`);
        }
      });

      prevStatusRef.current = newStatus;
    } catch (err) {
      console.error(err);
    }
  };

  // Get friendly color name
  const getColorName = (status) => {
    switch (status) {
      case "Safe":
        return "green";
      case "Alert":
        return "yellow";
      case "Critical":
        return "red";
      default:
        return "";
    }
  };

  // Speech
  const speak = (message) => {
    if ("speechSynthesis" in window && !alertRef.current) {
      alertRef.current = true;
      const speech = new SpeechSynthesisUtterance(message);
      speech.lang = "en-IN";
      speech.rate = 0.85; // slower for clarity
      speech.pitch = 1;
      window.speechSynthesis.speak(speech);
      speech.onend = () => setTimeout(() => (alertRef.current = false), 500);
    }
  };

  // Preload audio
  const audioRefs = {
    Safe: new Audio("/sounds/safe.mp3"),
    Alert: new Audio("/sounds/warning.mp3"),
    Critical: new Audio("/sounds/alarm.mp3"),
  };

  // Play sound
  const playSound = (level) => {
    const audio = audioRefs[level] || audioRefs["Safe"];
    audio.currentTime = 0;
    audio.play().catch((err) => console.error("Audio playback error:", err));
  };

  const triggerAlert = async (loc) => {
    try {
      const resp = await api.post(`/emergency/alert/${loc}`);
      const newStatus = resp.data.status;
      fetchStatus();
      playSound(newStatus);
      speak(`${loc} is now ${newStatus} (${getColorName(newStatus)})`);
      alert(`${resp.data.message} - Status: ${newStatus}`);
    } catch (err) {
      console.error(err);
    }
  };

  const getExits = async (loc) => {
    try {
      const resp = await api.get(`/emergency/exits/${loc}`);
      const exitsMsg = `Emergency exits for ${loc} are: ${resp.data.exits.join(", ")}`;
      speak(exitsMsg);
      alert(exitsMsg);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Color mapping for table
  const statusColors = {
    Safe: "#d9f7be",
    Alert: "#fff566",
    Critical: "#ff4d4f",
  };

  return (
    <div style={{ padding: 30 }}>
      <h2 style={{ fontSize: "2em", marginBottom: "1rem" }}>🚨 Emergency Management</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ fontSize: "1.2em", backgroundColor: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ccc", padding: "14px" }}>Location</th>
            <th style={{ border: "1px solid #ccc", padding: "14px" }}>Status</th>
            <th style={{ border: "1px solid #ccc", padding: "14px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => {
            const bgColor = statusColors[status[loc]] || "#d9f7be";
            return (
              <tr key={loc} style={{ fontSize: "1.1em" }}>
                <td style={{ border: "1px solid #ccc", padding: "12px" }}>{loc}</td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "12px",
                    fontWeight: "bold",
                    backgroundColor: bgColor,
                    textAlign: "center",
                  }}
                >
                  {status[loc] || "Safe"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "12px" }}>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      style={{ padding: "10px 15px", fontSize: "1em", cursor: "pointer" }}
                      onClick={() => triggerAlert(loc)}
                    >
                      Trigger Alert
                    </button>
                    <button
                      style={{ padding: "10px 15px", fontSize: "1em", cursor: "pointer" }}
                      onClick={() => getExits(loc)}
                    >
                      Show Exits
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
