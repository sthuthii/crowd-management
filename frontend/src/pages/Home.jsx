// Home.js
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
      <section className="hero">
        <h1 className="hero-title">Welcome to Somanth Temple</h1>
        <p className="hero-subtitle">
          Your smart companion for a smooth and stress-free temple visit.
        </p>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About the App</h2>
        <p>
          Divine Crowd Sense is designed to help devotees plan their visit to the temple with real-time
          crowd management insights. Whether it's finding available parking, checking shuttle status,
          or getting live traffic advisories, this app ensures a peaceful experience.
        </p>
        <p>
          Our goal is to minimize waiting time, improve accessibility, and provide key information about
          darshan timings, queues, and temple facilities — all at your fingertips.
        </p>
      </section>

      {/* Goals Section */}
      <section className="goals">
        <div className="goal-card">
          <FaCar className="goal-icon" />
          <h3>Parking Guidance</h3>
          <p>Find the best available parking spots and get recommendations in real-time.</p>
        </div>
        <div className="goal-card">
          <FaBus className="goal-icon" />
          <h3>Shuttle Tracking</h3>
          <p>Know where shuttles are and how many passengers are onboard for safe travel inside the temple campus.</p>
        </div>
        <div className="goal-card">
          <FaUserFriends className="goal-icon" />
          <h3>Crowd Insights</h3>
          <p>Get real-time advisory on crowd density and plan your visit accordingly to avoid peak times.</p>
        </div>
        <div className="goal-card">
          <FaClock className="goal-icon" />
          <h3>Darshan Timings</h3>
          <p>Check the timings of different darshan sessions and manage your schedule efficiently.</p>
        </div>
      </section>

      {/* Darshan Timings */}
      <section className="darshan">
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
      <section className="cta">
        <h2>Plan Your Visit Today</h2>
        <p>Use the dashboard to check traffic, parking, queue status, and darshan schedules — all in real-time.</p>
        <a href="/dashboard" className="cta-button">Go to Dashboard</a>
      </section>
    </div>
  );
}
