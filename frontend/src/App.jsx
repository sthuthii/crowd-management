import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import "./styles/components.css";

import Navbar from "./components/Navbar";
import AccessibilityMenu from "./components/AccessibilityMenu";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Traffic from "./pages/Traffic";
import Queue from "./pages/Queue";
import Accessibility from "./pages/Accessibility";
import Emergency from "./pages/Emergency";

import { speak as ttsSpeak } from "./services/tts";

function App() {
  const [textSize, setTextSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const accessibilityRef = useRef(null);

  return (
    <Router>
      <Navbar />

      <div className="fixed bottom-4 right-4 z-50">
        <AccessibilityMenu
          onTextResize={setTextSize}
          onContrastToggle={() => setHighContrast(!highContrast)}
          onSpeak={ttsSpeak}
          onNavigateRoute={(routeName) => accessibilityRef.current?.navigateToRouteByName(routeName)}
          onStopNavigation={() => { accessibilityRef.current?.stopNavigation(); ttsSpeak("Navigation stopped."); }}
        />
      </div>

      <div className={`main-content ${highContrast ? "high-contrast" : ""}`} style={{ fontSize: `${textSize}px` }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/traffic" element={<Traffic />} />
          <Route path="/queue" element={<Queue />} />

          <Route path="/accessibility" element={<AccessibilityWrapper ref={accessibilityRef} textSize={textSize} highContrast={highContrast} speak={ttsSpeak} />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

const AccessibilityWrapper = forwardRef(({ textSize, highContrast, speak }, ref) => {
  const routes = [
    { id: 1, name: "Main Entrance to Darshan Hall", coords: [12.915, 74.856], info: "Wide ramp available" },
    { id: 2, name: "Ramp to Temple Garden", coords: [12.916, 74.857], info: "Gentle slope" },
    { id: 3, name: "Accessible Restroom", coords: [12.917, 74.858], info: "Near the garden exit" },
    { id: 4, name: "Prayer Hall Ramp", coords: [12.914, 74.855], info: "Handrails on both sides" },
  ];

  const accessibilityRefInner = useRef(null);

  useImperativeHandle(ref, () => ({
    navigateToRouteByName(routeName) {
      const route = routes.find(r => r.name === routeName);
      if (route) accessibilityRefInner.current?.navigateToRoute(route);
    },
    stopNavigation() { accessibilityRefInner.current?.stopNavigation(); }
  }));

  return <Accessibility ref={accessibilityRefInner} textSize={textSize} highContrast={highContrast} speak={speak} routes={routes} />;
});

export default App;
