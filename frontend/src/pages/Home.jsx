import React from "react";
import "./Home.css";
import { FaBus, FaCar, FaUserFriends, FaClock } from "react-icons/fa";

export default function Home() {
  const darshanTimings = [
    { time: "06:00 AM - 08:00 AM", type: "Morning Darshan" },
    { time: "08:30 AM - 10:30 AM", type: "Special Darshan" },
    { time: "11:00 AM - 01:00 PM", type: "Midday Darshan" },
    { time: "04:00 PM - 06:00 PM", type: "Evening Darshan" },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero card-section">
        <h1 className="hero-title">Welcome to DarshanSahay</h1>
        <p className="hero-subtitle">
          Your smart companion for a smooth, safe, and serene temple visit.
        </p>
      </section>

      {/* Key Features Section (formerly Goals) */}
      <section className="card-section">
        <h2>Key Features</h2>
        <div className="goals-grid">
            <div className="goal-card">
              <FaCar className="goal-icon" />
              <h3>Smart Parking</h3>
              <p>Find available parking spots and get real-time recommendations.</p>
            </div>
            <div className="goal-card">
              <FaBus className="goal-icon" />
              <h3>Shuttle Tracking</h3>
              <p>Track live shuttle locations for convenient travel inside the temple campus.</p>
            </div>
            <div className="goal-card">
              <FaUserFriends className="goal-icon" />
              <h3>Crowd Insights</h3>
              <p>View real-time crowd density and plan your visit to avoid peak hours.</p>
            </div>
            <div className="goal-card">
              <FaClock className="goal-icon" />
              <h3>Live Timings</h3>
              <p>Check schedules for darshan and other events to manage your time efficiently.</p>
            </div>
        </div>
      </section>

      {/* Darshan Timings */}
      <section className="card-section">
        <h2>Darshan Timings</h2>
        <div className="darshan-grid">
          {darshanTimings.map((slot, idx) => (
            <div key={idx} className="darshan-card">
              <h3>{slot.type}</h3>
              <p>{slot.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="card-section">
        <h2>Plan Your Visit Today</h2>
        <p>Use the dashboard to check traffic, parking, queue status, and live schedules.</p>
        <a href="/dashboard" className="cta-button">Go to Dashboard</a>
      </section>
    </div>
  );
}

