import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './DevoteeHeader.css';

const DevoteeHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      {/* Top row with title and login/logout */}
      <div className="header-top-row">
        <div>
          <h1 className="header-title">TirthaSaathi</h1>
          <p className="header-subtitle">Smart Crowd Management</p>
        </div>
        <div>
          {user ? (
            <button className="header-action-button" onClick={handleLogout}>
              Logout ({user.username})
            </button>
          ) : (
            <Link to="/login" className="header-action-button">
              Admin Login
            </Link>
          )}
        </div>
      </div>

      {/* Bottom row with main navigation links */}
      <nav className="header-nav-links">
        {/* Devotee Links */}
        {(!user || user.role !== 'admin') && (
            <>
                <Link className="nav-link" to="/">Emergency SOS</Link>
                <Link className="nav-link" to="/lost-and-found">Lost & Found</Link>
                <Link className="nav-link" to="/evacuation">Find Exits</Link>
            </>
        )}
        {/* Admin Links */}
        {user && user.role === 'admin' && (
            <>
                <Link className="nav-link" to="/admin">Admin Dashboard</Link>
                <Link className="nav-link" to="/register">Register User</Link>
            </>
        )}
      </nav>
    </header>
  );
};

export default DevoteeHeader;