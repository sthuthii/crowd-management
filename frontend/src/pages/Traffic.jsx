import React, { useState, useEffect } from "react";
import api from "../services/api";
import TrafficFlow from "../components/TrafficFlow";
import './Traffic.css'; // Import the new CSS file

const shuttleLocations = [
  "Parking Lot Entrance", "Main Temple Gate", "Cafeteria", "North Gate", "South Gate"
];

export default function Traffic() {
  const [parking, setParking] = useState(null);
  const [shuttles, setShuttles] = useState(null);
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data fetching logic remains the same
  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const [parkingResp, shuttlesResp, advisoryResp] = await Promise.all([
          api.get("/parking"), api.get("/shuttle"), api.get("/traffic-advisory")
        ]);
        setParking(parkingResp.data);
        setShuttles(shuttlesResp.data);
        setAdvisory(advisoryResp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTraffic();
    const interval = setInterval(fetchTraffic, 5000);
    return () => clearInterval(interval);
  }, []);

  const getAdvisoryClass = (code) => {
    if (code === "RED") return "alert-error";
    if (code === "YELLOW") return "alert-warning";
    return "alert-success";
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>; 
  }

  return (
    <div className="traffic-dashboard">
      <h1 className="dashboard-title">Live Temple Dashboard</h1>

      {/* Main Advisory Alert */}
      {advisory && (
        <div className={`advisory-alert ${getAdvisoryClass(advisory.action_code)}`}>
          <strong>{advisory.severity} Advisory</strong>
          {advisory.advisory_message}
        </div>
      )}

      <div className="dashboard-grid">
        {/* Parking Card */}
        <div className="grid-item">
          <div className="status-card">
            <div className="card-header">
              <span className="card-header-icon"></span>
              <h2>Parking Status</h2>
            </div>
            {parking ? (
              <div className="parking-body">
                <div className="available-slots">{parking.overall_available_slots}</div>
                <div className="slots-label">Slots Available</div>
                <div className="recommended-chip">Recommended: {parking.recommended_level}</div>
              </div>
            ) : <p>Loading...</p>}
          </div>
        </div>

        {/* Shuttle Card */}
        <div className="grid-item">
          <div className="status-card">
            <div className="card-header">
              <span className="card-header-icon"></span>
              <h2>Shuttle Status</h2>
            </div>
            {shuttles && shuttles.length > 0 ? (
              <ul className="shuttle-list">
                {shuttles.map((s, idx) => (
                  <li key={s.id} className="shuttle-list-item">
                    <div className="shuttle-info">
                      <strong>{s.id}</strong><br />
                      <span>Near {shuttleLocations[idx % shuttleLocations.length]}</span>
                    </div>
                    <span className="passenger-chip">{s.occupied} passengers</span>
                  </li>
                ))}
              </ul>
            ) : <p>No shuttle data.</p>}
          </div>
        </div>
        
        {/* Traffic Flow Chart Card */}
        <div className="grid-item full-width">
          <div className="status-card">
            <div className="card-header">
              <span className="card-header-icon"></span>
              <h2>Crowd and Vehicle Flow</h2>
            </div>
            <TrafficFlow traffic={advisory?.traffic_flow} />
          </div>
        </div>
      </div>
      
      <p className="footer-text">🔄 Dashboard automatically updates</p>
    </div>
  );
}