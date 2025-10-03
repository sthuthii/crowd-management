// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">TirthaSaathi</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            
            // ... (add a new Link to the list)
<ul className="navbar-nav me-auto mb-2 mb-lg-0">
    <li className="nav-item">
        <Link className="nav-link" to="/">Emergency SOS</Link>
    </li>
    <li className="nav-item">
        <Link className="nav-link" to="/lost-and-found">Lost & Found</Link>
    </li>
    <li className="nav-item">
        <Link className="nav-link" to="/admin">Admin</Link> {/* <-- Add this new link */}
    </li>
</ul>
// ...
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;