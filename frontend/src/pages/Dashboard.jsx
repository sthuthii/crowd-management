import React, { useEffect, useState } from "react";
import QueueStats from "../components/QueueStats";
import TrafficFlow from "../components/TrafficFlow";
import CrowdStats from "../components/CrowdStats";
import api from "../services/api";

export default function Dashboard() {
  const [accessibility, setAccessibility] = useState({});
  const [emergency, setEmergency] = useState({});

  // Fetch accessibility info
  const fetchAccessibility = async () => {
    try {
      const resp = await api.get("/accessibility/accessibility");
      setAccessibility(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch emergency status
  const fetchEmergency = async () => {
    try {
      const resp = await api.get("/emergency/status");
      setEmergency(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAccessibility();
    fetchEmergency();

    const interval = setInterval(() => {
      fetchAccessibility();
      fetchEmergency();
    }, 5000); // Auto-refresh

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-content">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        {/* Queue Overview */}
        <section>
          <h2>Queue Overview</h2>
          <QueueStats />
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
