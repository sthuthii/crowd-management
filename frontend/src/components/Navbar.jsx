import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for the burger menu
import "./Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="main-navbar">
      <NavLink to="/" className="navbar-brand">
        DarshanSahay
      </NavLink>

      <ul className={isMobileMenuOpen ? "nav-links mobile-active" : "nav-links"}>
        {/* Add onClick to close menu when a link is clicked on mobile */}
        <li><NavLink to="/dashboard" onClick={toggleMobileMenu}>Dashboard</NavLink></li>
        <li><NavLink to="/traffic" onClick={toggleMobileMenu}>Traffic</NavLink></li>
        <li><NavLink to="/queue" onClick={toggleMobileMenu}>Queue</NavLink></li>
        <li><NavLink to="/accessibility" onClick={toggleMobileMenu}>Accessibility</NavLink></li>
        <li><NavLink to="/emergency" onClick={toggleMobileMenu}>Emergency</NavLink></li>
        <li><NavLink to="/lost-and-found" onClick={toggleMobileMenu}>Lost and Found</NavLink></li>
        <li><NavLink to="/evacuation" onClick={toggleMobileMenu}>Evacuation</NavLink></li>
      </ul>

      <button className="navbar-burger" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
};

export default Navbar;

