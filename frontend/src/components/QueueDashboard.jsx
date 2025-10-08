import React from "react";
import useQueues from "../hooks/useQueues";
import './QueueDashboard.css'; 

export default function QueueDashboard({ language }) {
  const { queues, joinQueue, serveNext, loading, error } = useQueues(language);

  if (loading) return <p className="loading-text">Loading queues...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!Object.keys(queues).length) return <p className="loading-text">No queue data available</p>;

  return (
    <div className="queue-dashboard">
      {/* Queue Controls */}
      {Object.entries(queues).map(([location, counts]) => (
        <div key={location} className="queue-card">
          <h3 className="queue-card-title">{location}</h3>
          <div className="queue-counts">
            <div>Normal Queue: <strong>{counts.normal}</strong></div>
            <div>Priority Queue: <strong>{counts.priority}</strong></div>
          </div>
          <div className="button-group">
            <button onClick={() => joinQueue(location, "normal")} className="btn btn-green">
              Join Normal
            </button>
            <button onClick={() => joinQueue(location, "priority")} className="btn btn-yellow">
              Join Priority
            </button>
            <button onClick={() => serveNext(location, "normal")} className="btn btn-blue">
              Serve Normal
            </button>
            <button onClick={() => serveNext(location, "priority")} className="btn btn-red">
              Serve Priority
            </button>
          </div>
        </div>
      ))}

      {/* Live Queue Stats Summary */}
      <div>
        <h3 className="summary-title">Queue Summary</h3>
        <table className="summary-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Normal Queue</th>
              <th>Priority Queue</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(queues).map(([location, counts]) => (
              <tr key={location}>
                <td>{location}</td>
                <td>{counts.normal}</td>
                <td>{counts.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}