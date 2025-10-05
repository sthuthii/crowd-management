import React from "react";
import useQueues from "../hooks/useQueues";

export default function QueueManagement({ language }) {
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
    <div className="queue-management p-4">
      {Object.entries(queues).map(([location, counts]) => (
        <div
          key={location}
          className="mb-4 p-4 border rounded shadow-sm"
          style={{ fontSize: 18 }}
        >
          <h2 className="font-semibold mb-2">{location}</h2>
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
    </div>
  );
}
