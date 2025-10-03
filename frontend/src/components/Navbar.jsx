import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/prediction">Prediction</Link>
      <Link to="/traffic">Traffic</Link>
      <Link to="/queue">Queue</Link>
      <Link to="/accessibility">Accessibility</Link>
      <Link to="/emergency">Emergency</Link>
    </nav>
  );
}
