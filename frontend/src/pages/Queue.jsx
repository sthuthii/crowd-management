import React, { useState, useEffect } from "react";
import api from "../services/api";

const locations = ["Temple Gate", "Cafeteria", "Restroom A", "Restroom B"];

export default function Queue() {
  const [queues, setQueues] = useState({});

  const fetchQueues = async () => {
    try {
      const resp = await api.get("/queue/queues");
      setQueues(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const joinQueue = async (loc, priority=false) => {
    try {
      await api.post(`/queue/join-queue/${loc}`, null, { params: { priority } });
      fetchQueues();
    } catch (err) {
      console.error(err);
    }
  };

  const serveNext = async (loc) => {
    try {
      await api.post(`/queue/leave-queue/${loc}`);
      fetchQueues();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Queue Management (Priority Supported)</h2>
      {locations.map((loc) => (
        <div key={loc} style={{ marginBottom: 15 }}>
          <b>{loc}:</b> Normal: {queues[loc]?.normal || 0}, Priority: {queues[loc]?.priority || 0}
          <div style={{ marginTop: 5 }}>
            <button onClick={() => joinQueue(loc, false)}>Join Normal Queue</button>
            <button onClick={() => joinQueue(loc, true)}>Join Priority Queue</button>
            <button onClick={() => serveNext(loc)}>Serve Next</button>
          </div>
        </div>
      ))}
    </div>
  );
}
