import React, { useEffect, useState } from "react";
import api from "../services/api";

const locations = ["Main Hall", "Temple Gate", "Cafeteria", "Parking Lot"];

export default function Emergency() {
  const [status, setStatus] = useState({});

  const fetchStatus = async () => {
    try {
      const resp = await api.get("/emergency/status");
      setStatus(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerAlert = async (loc) => {
    try {
      const resp = await api.post(`/emergency/alert/${loc}`);
      fetchStatus();
      alert(resp.data.message + " - Status: " + resp.data.status);
    } catch (err) {
      console.error(err);
    }
  };

  const getExits = async (loc) => {
    try {
      const resp = await api.get(`/emergency/exits/${loc}`);
      alert("Emergency Exits for " + loc + ": " + resp.data.exits.join(", "));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Emergency Management</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc}>
              <td>{loc}</td>
              <td>{status[loc]}</td>
              <td>
                <button onClick={() => triggerAlert(loc)}>Trigger Alert</button>
                <button onClick={() => getExits(loc)}>Show Exits</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
