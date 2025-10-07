import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    /*{ name: "Prediction", path: "/prediction" },*/
    { name: "Traffic", path: "/traffic" },
    { name: "Queue", path: "/queue" },
    { name: "Accessibility", path: "/accessibility" },
    { name: "Emergency", path: "/emergency" },
    {name : "Lost and Found", path : "/lost-and-found"},
    {name : "Evacuation", path : "/evacuation"},

  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                  location.pathname === item.path
                    ? "bg-white text-indigo-700 font-semibold"
                    : "text-white hover:bg-white hover:text-indigo-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
