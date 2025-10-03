import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import "./styles/components.css";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Traffic from "./pages/Traffic";
import Queue from "./pages/Queue";
import Accessibility from "./pages/Accessibility";
import Emergency from "./pages/Emergency";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/traffic" element={<Traffic />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/emergency" element={<Emergency />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
