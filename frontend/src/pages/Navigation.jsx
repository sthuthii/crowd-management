import React, { useState } from "react";
import api from "../services/api";

const locations = ["Main Hall", "Temple Gate", "Dining Area", "Garden", "Parking"];

export default function Navigation() {
  const [start, setStart] = useState("Main Hall");
  const [end, setEnd] = useState("Dining Area");
  const [steps, setSteps] = useState([]);
  const [distance, setDistance] = useState(null);

  const getDirections = async () => {
    try {
      const resp = await api.get("/navigation/directions", { params: { start, end } });
      setSteps(resp.data.steps);
      setDistance(resp.data.total_distance_m);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch route");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Indoor Navigation</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Start: </label>
        <select value={start} onChange={(e) => setStart(e.target.value)}>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        &nbsp;&nbsp;
        <label>End: </label>
        <select value={end} onChange={(e) => setEnd(e.target.value)}>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        &nbsp;&nbsp;
        <button onClick={getDirections}>Get Directions</button>
      </div>

      {distance !== null && (
        <div>
          <h3>Route Summary</h3>
          <p><b>Total Distance:</b> {distance} meters</p>
          <h4>Steps:</h4>
          <ol>
            {steps.map((s, idx) => (
              <li key={idx}>{s.instruction} ({s.distance_m}m)</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
