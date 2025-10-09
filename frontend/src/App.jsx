import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/global.css";
import "./styles/components.css";

// Components
import Navbar from "./components/Navbar";
import AccessibilityMenu from "./components/AccessibilityMenu";
import AlertsDisplay from "./components/AlertsDisplay";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Traffic from "./pages/Traffic";
import Accessibility from "./pages/Accessibility";
import Emergency from "./pages/Emergency";
import LostAndFound from "./pages/LostAndFound";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import EvacuationPage from "./pages/EvacuationPage";
import QueueDashboard from "./components/QueueDashboard";
import Register from "./pages/Register";

// TTS
import { speak as ttsSpeak } from "./services/tts";
import QueueListPage from "./pages/QueueListPage";
import BookPassPage from "./pages/BookPassPage";
import MyPassPage from "./pages/MyPassPage";

function App() {
  const [textSize, setTextSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const accessibilityRef = useRef(null);

  return (
    <>
      <Navbar />
      <AlertsDisplay />

      {/* Accessibility Menu */}
      <div className="fixed-accessibility">
        <AccessibilityMenu
          onTextResize={setTextSize}
          onContrastToggle={() => setHighContrast(!highContrast)}
          onSpeak={ttsSpeak}
          onNavigateRoute={(routeName) =>
            accessibilityRef.current?.navigateToRouteByName(routeName)
          }
          onStopNavigation={() => {
            accessibilityRef.current?.stopNavigation();
            ttsSpeak("Navigation stopped.");
          }}
        />
      </div>

      <div
        className={`main-content ${highContrast ? "high-contrast" : ""}`}
        style={{ fontSize: `${textSize}px` }}
      >
        <Routes>
          {/* --- Main Pages --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/traffic" element={<Traffic />} />
          <Route path="/accessibility" element={
            <AccessibilityWrapper
              ref={accessibilityRef}
              textSize={textSize}
              highContrast={highContrast}
              speak={ttsSpeak}
            />
          }/>
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/lost-and-found" element={<LostAndFound />} />
           <Route path="/evacuation" element={<EvacuationPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* --- Queue Ticketing Feature --- */}
          <Route path="/queue" element={<QueueListPage language="en-US" />} />
          <Route path="/pass-list" element={<BookPassPage language="en-US" />} />
          <Route path="/mypass" element={<MyPassPage language="en-US" />} />

          {/* --- Fallback --- */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </>
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
      const route = routes.find((r) => r.name === routeName);
      if (route) accessibilityRefInner.current?.navigateToRoute(route);
    },
    stopNavigation() {
      accessibilityRefInner.current?.stopNavigation();
    },
  }));

  return (
    <Accessibility
      ref={accessibilityRefInner}
      textSize={textSize}
      highContrast={highContrast}
      speak={speak}
      routes={routes}
    />
  );
});

export default App;
