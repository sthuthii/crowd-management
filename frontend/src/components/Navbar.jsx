import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext'; // Make sure this path is correct

const Navbar = () => {
  // This line was likely missing
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">TirthaSaathi</Link>
        <div className="collapse navbar-collapse d-flex justify-content-between">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Emergency SOS</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/lost-and-found">Lost & Found</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin</Link>
            </li>
          </ul>

          {/* This is the part that uses the 'user' variable */}
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={logout}>Logout ({user.username})</button>
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