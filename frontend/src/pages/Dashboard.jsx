import React, { useState, useEffect } from "react";
import "./Dashboard.css"; // Import the new styles
import TrafficFlow from "../components/TrafficFlow";
import CrowdStats from "../components/CrowdStats";
import api from "../services/api";

// --- Sub-component for a single statistic ---
const StatCard = ({ title, value, label }) => (
  <div className="dashboard-card stat-card">
    <h3 className="card-title">{title}</h3>
    <div className="stat-value">{value}</div>
    <p className="stat-label">{label}</p>
  </div>
);

// --- Sub-component for the Queue Table ---
const QueueOverview = ({ data, error }) => (
  <div className="dashboard-card col-span-2">
    <h3 className="card-title">Queue Overview</h3>
    {error ? <p style={{ color: "red" }}>{error}</p> : (
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Normal Queue</th>
              <th>Priority Queue</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((loc) => (
              <tr key={loc}>
                <td>{loc}</td>
                <td>{data[loc].normal}</td>
                <td>{data[loc].priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// --- Sub-component for the Accessibility Table ---
const AccessibilityInfo = ({ data }) => (
  <div className="dashboard-card col-span-3">
    <h3 className="card-title">Accessibility Information</h3>
    <div className="table-container">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Location</th>
            <th>Ramps</th>
            <th>Priority Entrance</th>
            <th>Accessible Restroom</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((loc) => (
            <tr key={loc}>
              <td>{loc}</td>
              <td>{data[loc]?.ramps ? "Yes" : "No"}</td>
              <td>{data[loc]?.priority_entrance ? "Yes" : "No"}</td>
              <td>{data[loc]?.accessible ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Main Dashboard Component ---
const Dashboard = () => {
  const [accessibility, setAccessibility] = useState({});
  const [queueData, setQueueData] = useState({});
  const [queueError, setQueueError] = useState("");

  useEffect(() => {
    const fetchData = () => {
      // Fetch Queue Data
      fetch("http://127.0.0.1:8000/queue")
        .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch"))
        .then(data => {
          setQueueData(data);
          setQueueError("");
        })
        .catch(err => setQueueError("Failed to fetch queue data."));

      // Fetch Accessibility Data
      api.get("/accessibility/accessibility")
        .then(res => setAccessibility(res.data))
        .catch(err => console.error(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Temple Crowd Management Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card stat-card">
            <CrowdStats />
        </div>
        
        <StatCard title="Wait Time" value="25" label="Minutes (Avg)" />
        <StatCard title="Parking" value="85%" label="Capacity" />
        
        <div className="dashboard-card col-span-2">
          <h3 className="card-title">Traffic Overview</h3>
          <div className="chart-container">
            <TrafficFlow />
          </div>
        </div>

        <QueueOverview data={queueData} error={queueError} />
        
        <AccessibilityInfo data={accessibility} />
      </div>
    </div>
  );
};

export default Dashboard;

