// frontend/src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside style={{
      width: 220,
      padding: 12,
      background: "#f5f7fb",
      minHeight: "calc(100vh - 56px)",
      boxSizing: "border-box"
    }}>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ margin: 8 }}><Link to="/dashboard">Dashboard</Link></li>
          <li style={{ margin: 8 }}><Link to="/prediction">Prediction</Link></li>
          <li style={{ margin: 8 }}><Link to="/traffic">Traffic</Link></li>
          <li style={{ margin: 8 }}><Link to="/queue">Queue</Link></li>
          <li style={{ margin: 8 }}><Link to="/accessibility">Accessibility</Link></li>
          <li style={{ margin: 8 }}><Link to="/emergency">Emergency</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
