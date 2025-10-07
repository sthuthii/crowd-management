import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback, // 1. Import useCallback
} from "react";
import { useLocation } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";
import { speak } from "../services/tts";

const beepSound = "/sounds/beep-07.mp3";
const mapContainerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 20.8880, lng: 70.4013 };

const somnathRoutes = [
  { id: 1, name: "Main Gate", coords: { lat: 20.8885, lng: 70.4013 }, info: "You are at the Main Gate. Proceed straight for security check.", wheelchair: true, density: 1 },
  { id: 2, name: "Shoe Depository", coords: { lat: 20.8883, lng: 70.4010 }, info: "This is the shoe depository. Please deposit your footwear here.", wheelchair: true, density: 2 },
  { id: 3, name: "Security Check", coords: { lat: 20.8881, lng: 70.4013 }, info: "You have reached the security check. Please cooperate with the staff.", wheelchair: true, density: 2 },
  { id: 4, name: "Darshan Queue Entrance", coords: { lat: 20.8879, lng: 70.4015 }, info: "This is the entrance to the Darshan queue. The path is wheelchair accessible.", wheelchair: true, density: 3 },
  { id: 5, name: "Prasad Counter", coords: { lat: 20.8877, lng: 70.4011 }, info: "You can collect Prasad from this counter after your Darshan.", wheelchair: false, density: 1 },
  { id: 6, name: "Exit Gate", coords: { lat: 20.8875, lng: 70.4013 }, info: "This is the main exit gate. Thank you for your visit.", wheelchair: true, density: 1 },
];

const Accessibility = forwardRef(({ textSize, highContrast, language = "en-US" }, ref) => {
  const audioRef = useRef(null);
  const mapRef = useRef(null);
  const location = useLocation();

  const [routes, setRoutes] = useState(somnathRoutes);
  const [activeRoute, setActiveRoute] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [pulseRadius, setPulseRadius] = useState(15);
  
  // 2. State to hold the location name from the dashboard
  const [initialLocation, setInitialLocation] = useState(null);

  const handleRouteClick = useCallback((route) => {
    if (!route) return;
    const infoMsg = `${route.name}. ${route.info}. ${route.wheelchair ? "This path is wheelchair accessible." : "This path may have stairs or slopes."} Crowd level is ${["low", "medium", "high"][route.density - 1] || "unknown"}.`;
    speak(infoMsg, language);
    audioRef.current?.play();
    setActiveRoute(route);
    setSelectedRoute(route);
    navigator.vibrate?.(50);
    if (mapRef.current) {
      mapRef.current.panTo(route.coords);
    }
  }, [language]);

  // 3. This effect now only saves the target location name and doesn't interact with the map
  useEffect(() => {
    if (location.state?.location) {
      setInitialLocation(location.state.location);
    }
  }, [location.state]);

  useEffect(() => {
    if (!activeRoute) return;
    let growing = true;
    const interval = setInterval(() => {
      setPulseRadius((prev) => {
        if (prev >= 25) growing = false;
        if (prev <= 15) growing = true;
        return growing ? prev + 1 : prev - 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [activeRoute]);

  // 4. The onMapLoad function now handles the initial navigation
  const onMapLoad = useCallback((map) => {
    mapRef.current = map; // Save the map instance so we can control it
    
    // Check if a location was passed from the dashboard
    if (initialLocation) {
      const routeToActivate = routes.find(r => r.name === initialLocation);
      if (routeToActivate) {
        // NOW that the map is loaded, we can safely call the function
        handleRouteClick(routeToActivate);
      }
    }
  }, [initialLocation, routes, handleRouteClick]);


  const getMarkerIcon = (route) => {
    const colors = ["green", "yellow", "red"];
    const color = colors[route.density - 1] || "red";
    return `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;
  };

  useImperativeHandle(ref, () => ({
    navigateToRoute(routeName) {
      const matched = routes.find(r => r.name.toLowerCase() === routeName.toLowerCase());
      if (matched) handleRouteClick(matched);
    },
    stopNavigation() {
      setActiveRoute(null);
      setSelectedRoute(null);
    },
  }));

  return (
    <div className={`accessibility-container ${highContrast ? "high-contrast" : ""}`} style={{ fontSize: `${textSize}px` }}>
      <h1 tabIndex="0" className="font-bold text-xl mb-2">Accessibility Navigation</h1>

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={18}
          onLoad={onMapLoad} // 5. Use the new, smarter onLoad function
        >
          {routes.map((route) => (
            <Marker
              key={route.id}
              position={route.coords}
              onClick={() => handleRouteClick(route)}
              icon={{ url: getMarkerIcon(route) }}
              title={`${route.name}${route.wheelchair ? " ♿" : ""}`}
            />
          ))}

          {selectedRoute && (
            <>
              <InfoWindow position={selectedRoute.coords} onCloseClick={() => setSelectedRoute(null)}>
                <div style={{ minWidth: 180 }}>
                  <strong>{selectedRoute.name}</strong>
                  <p style={{ margin: "6px 0" }}>{selectedRoute.info}</p>
                  {selectedRoute.wheelchair && <p style={{ margin: "6px 0" }}>♿ Wheelchair-Friendly</p>}
                  <p style={{ marginTop: 6 }}>Crowd Density: <strong>{["Low", "Medium", "High"][selectedRoute.density - 1] || "Unknown"}</strong></p>
                </div>
              </InfoWindow>

              <Circle
                center={selectedRoute.coords}
                radius={pulseRadius}
                options={{
                  strokeColor: "blue",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "blue",
                  fillOpacity: 0.12,
                  clickable: false,
                  draggable: false,
                  visible: true,
                }}
              />
            </>
          )}
        </GoogleMap>
      </LoadScript>

      <audio ref={audioRef} src={beepSound} preload="auto" />
    </div>
  );
});

export default Accessibility;