import React, { useEffect, useState } from "react";
import TrafficFlow from "../components/TrafficFlow";
import CrowdStats from "../components/CrowdStats";
import api from "../services/api";

export default function Dashboard() {
  const [accessibility, setAccessibility] = useState({});
  const [emergency, setEmergency] = useState({});
  const [queueData, setQueueData] = useState({});
  const [queueError, setQueueError] = useState("");

  // ✅ Fetch queue data
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

  // ✅ Fetch accessibility info
  const fetchAccessibility = async () => {
    try {
      const resp = await api.get("/accessibility/accessibility");
      setAccessibility(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch emergency status
  const fetchEmergency = async () => {
    try {
      const resp = await api.get("/emergency/status");
      setEmergency(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Auto refresh every 5 seconds
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
    <div className="main-content">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        {/* ✅ Queue Overview */}
        <section>
          <h2>Queue Overview</h2>
          {queueError ? (
            <p style={{ color: "red" }}>{queueError}</p>
          ) : (
            <table>
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
          )}
        </section>

        {/* Traffic Overview */}
        <section>
          <h2>Traffic Overview</h2>
          <TrafficFlow />
        </section>

        {/* Crowd Overview */}
        <section>
          <h2>Crowd Overview</h2>
          <CrowdStats />
        </section>

        {/* Accessibility Info */}
        <section>
          <h2>Accessibility Information</h2>
          <table>
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
                  <td>{accessibility[loc]?.priority_entrance ? "Yes" : "No"}</td>
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
        </section>

        {/* Emergency Status */}
        <section>
          <h2>Emergency Status</h2>
          <table>
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
        </section>
      </div>
    </div>
  );
}
