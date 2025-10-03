import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "../styles/components.css";

const beepSound = "https://www.soundjay.com/buttons/sounds/beep-07.mp3";

const Accessibility = forwardRef(({ textSize, highContrast, speak, routes }, ref) => {
  const audioRef = useRef(null);
  const [activeRoute, setActiveRoute] = useState(null);

  // Real-time guidance for active route
  useEffect(() => {
    if (!activeRoute) return;

    const interval = setInterval(() => {
      speak(`Keep moving toward ${activeRoute.name}. ${activeRoute.info}`);
      audioRef.current?.play();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeRoute, speak]);

  const handleRouteClick = (route) => {
    if (audioRef.current) audioRef.current.play();
    speak(`Proceed to ${route.name}. ${route.info}`);
    setActiveRoute(route); // start or switch navigation
  };

  const handleEmergencyClick = () => {
    if (audioRef.current) audioRef.current.play();
    speak("Emergency! Please follow the nearest exit immediately.");
    alert("🚨 Emergency Alert! Security has been notified.");
    setActiveRoute(null); // stop navigation
  };

  // Expose methods for App / AccessibilityMenu via ref
  useImperativeHandle(ref, () => ({
    navigateToRoute(route) {
      if (!route) return;
      // Match route by name case-insensitively
      const matchedRoute = routes.find(r => r.name.toLowerCase() === route.name.toLowerCase());
      if (matchedRoute) handleRouteClick(matchedRoute);
    },
    stopNavigation() {
      setActiveRoute(null);
    }
  }));

  return (
    <div
      className={`accessibility-container ${highContrast ? "high-contrast" : ""}`}
      style={{ fontSize: `${textSize}px` }}
    >
      <h1>Accessibility Navigation</h1>

      <MapContainer center={[12.915, 74.856]} zoom={17} className="accessibility-map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {routes.map((route) => (
          <React.Fragment key={route.id}>
            <Marker position={route.coords} eventHandlers={{ click: () => handleRouteClick(route) }}>
              <Popup>
                <strong>{route.name}</strong>
                <p>{route.info}</p>
              </Popup>
            </Marker>

            {activeRoute?.id === route.id && (
              <CircleMarker
                center={route.coords}
                radius={15}
                color="red"
                fillColor="red"
                fillOpacity={0.5}
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button className="sos-button" onClick={handleEmergencyClick}>
          🚨 SOS / Emergency
        </button>
      </div>

      <audio ref={audioRef} src={beepSound} preload="auto" />
    </div>
  );
});

export default Accessibility;
