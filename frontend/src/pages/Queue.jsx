import React from "react";
import QueueDashboard from "../components/QueueDashboard";
import './Queue.css'; 

export default function Queue({ language = "en-US" }) {
  return (
    <div className="queue-page">
      <h1 className="dashboard-title">Queue Management & Stats</h1>
      <div className="queue-section">
        <QueueDashboard language={language} />
      </div>
    </div>
  );
}