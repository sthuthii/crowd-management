import React from "react";
import useQueues from "../hooks/useQueues";

export default function QueueDashboard({ language }) {
  const { queues, joinQueue, serveNext, loading, error } = useQueues(language);

  if (loading)
    return <p style={{ textAlign: "center", fontSize: 18 }}>Loading queues...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", fontSize: 18 }}>{error}</p>
    );
  if (!Object.keys(queues).length)
    return (
      <p style={{ textAlign: "center", fontSize: 18 }}>No queue data available</p>
    );

  return (
    <div className="queue-dashboard p-4">
      <h2 style={{ fontSize: "1.8em", marginBottom: "1rem" }}>
        Queue Management & Stats
      </h2>

      {/* Queue Controls */}
      {Object.entries(queues).map(([location, counts]) => (
        <div
          key={location}
          className="mb-4 p-4 border rounded shadow-sm"
          style={{ fontSize: 18 }}
        >
          <h3 className="font-semibold mb-2">{location}</h3>
          <div className="flex gap-4 mb-3">
            <div>Normal Queue: {counts.normal}</div>
            <div>Priority Queue: {counts.priority}</div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => joinQueue(location, "normal")}
              style={{
                padding: "10px 15px",
                fontSize: 16,
                backgroundColor: "#52c41a",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Join Normal
            </button>
            <button
              onClick={() => joinQueue(location, "priority")}
              style={{
                padding: "10px 15px",
                fontSize: 16,
                backgroundColor: "#faad14",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Join Priority
            </button>
            <button
              onClick={() => serveNext(location, "normal")}
              style={{
                padding: "10px 15px",
                fontSize: 16,
                backgroundColor: "#1890ff",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Serve Normal
            </button>
            <button
              onClick={() => serveNext(location, "priority")}
              style={{
                padding: "10px 15px",
                fontSize: 16,
                backgroundColor: "#f5222d",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Serve Priority
            </button>
          </div>
        </div>
      ))}

      {/* Live Queue Stats Summary */}
      <div className="mt-8 border-t pt-4">
        <h3 style={{ fontSize: "1.4em", marginBottom: "0.5rem" }}>Queue Summary</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Location</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Normal Queue</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Priority Queue</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(queues).map(([location, counts]) => (
              <tr key={location}>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>{location}</td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>{counts.normal}</td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>{counts.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
