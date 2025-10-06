import React from "react";
import QueueManagement from "../components/QueueManagement";
import QueueStats from "../components/QueueStats";

export default function Queue({ language = "en-US" }) {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Queue Management & Stats</h1>

      {/* Queue management buttons */}
      <div style={{ marginBottom: 40 }}>
        <QueueManagement language={language} />
      </div>

      {/* Queue stats chart */}
      <div>
        <QueueStats language={language} />
      </div>
    </div>
  );
}
