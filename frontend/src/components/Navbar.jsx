import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to the home page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">TirthaSaathi</Link>
        <div className="collapse navbar-collapse d-flex justify-content-between">
          
          {/* Main Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Show these links only if you are NOT an admin */}
            {(!user || user.role !== 'admin') && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Emergency SOS</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/lost-and-found">Lost & Found</Link>
                </li>
                <li className="nav-item">
    <Link className="nav-link" to="/evacuation">Find Exits</Link> {/* <-- Add Link */}
</li>
              </>
            )}
            {/* Show this link only FOR admins */}
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Dashboard</Link>
              </li>
            )}
          </ul>

          {/* Login/Logout Section */}
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>Logout ({user.username})</button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Admin Login</Link>
              </li>
            )}
          </ul>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;