import React, { useState, useEffect } from "react";
import api from "../services/api";
import TrafficFlow from "../components/TrafficFlow";

export default function Traffic() {
  const [traffic, setTraffic] = useState({});

  const fetchTraffic = async () => {
    try {
      const resp = await api.get("/traffic/traffic");
      setTraffic(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTraffic();
    const interval = setInterval(fetchTraffic, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">Traffic Management</h1>
      <div className="traffic-section">
        <TrafficFlow traffic={traffic} />
      </div>
    </div>
  );
}
