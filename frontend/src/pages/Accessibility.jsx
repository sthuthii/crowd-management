import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";
import axios from "axios";
import { speak, stopSpeaking } from "../services/tts";

const beepSound = "https://www.soundjay.com/buttons/sounds/beep-07.mp3";
const mapContainerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 12.915, lng: 74.856 };

const Accessibility = forwardRef(({ textSize, highContrast, language = "en-US" }, ref) => {
  const audioRef = useRef(null);
  const mapRef = useRef(null);

  const [routes, setRoutes] = useState([]);
  const [priorityRoutes, setPriorityRoutes] = useState([]);
  const [activeRoute, setActiveRoute] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [pulseRadius, setPulseRadius] = useState(15);
  const [slots, setSlots] = useState([]);
  const [slotAlert, setSlotAlert] = useState(null);
  const slotAlertTimerRef = useRef(null);

  // Fetch routes and priority routes
  useEffect(() => {
    let mounted = true;
    const fetchRoutes = async () => {
      try {
        const [accessRes, priorityRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/accessibility/accessibility"),
          axios.get("http://127.0.0.1:8000/priority/priority/"),
        ]);

        const accessRoutes = Object.entries(accessRes.data).map(([name, coords], idx) => ({
          id: Math.random() + idx,
          name,
          coords: Array.isArray(coords) && coords.length === 2
            ? coords
            : [defaultCenter.lat + idx * 0.0005, defaultCenter.lng + idx * 0.0005],
          info: typeof coords === "object" ? JSON.stringify(coords) : "Accessible route",
          density: Math.floor(Math.random() * 3),
          wheelchair: Math.random() < 0.5,
        }));

        const priority = priorityRes.data.map(r => ({
          id: r.id + 1000,
          name: r.name,
          coords: Array.isArray(r.coords || r.location) ? (r.coords || r.location) : [defaultCenter.lat, defaultCenter.lng],
          info: r.info || "",
          density: r.density || 0,
          wheelchair: r.wheelchair || false,
        }));

        if (!mounted) return;
        setRoutes(accessRoutes);
        setPriorityRoutes(priority);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
    return () => { mounted = false; };
  }, []);

  // Map bounds
  useEffect(() => {
    if (!mapRef.current) return;
    try {
      const bounds = new window.google.maps.LatLngBounds();
      [...routes, ...priorityRoutes].forEach((route) => {
        if (route.coords && route.coords.length === 2) bounds.extend({ lat: route.coords[0], lng: route.coords[1] });
      });
      if (!bounds.isEmpty) mapRef.current.fitBounds(bounds);
    } catch (err) {}
  }, [routes, priorityRoutes]);

  // Pulse effect
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

  // Audio guidance
  useEffect(() => {
    if (!activeRoute) return;
    const interval = setInterval(() => {
      speak(`Keep moving toward ${activeRoute.name}. ${activeRoute.info}`, language);
      audioRef.current?.play();
      navigator.vibrate?.(100);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeRoute, language]);

  // Fetch darshan slots
  useEffect(() => {
    let mounted = true;
    const fetchSlots = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/darshan-slots");
        if (!mounted) return;
        setSlots(res.data || []);
      } catch (err) {
        console.error("Error fetching darshan slots:", err);
      }
    };
    fetchSlots();
    const interval = setInterval(fetchSlots, 60000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Announce slot updates
  useEffect(() => {
    if (!slots || slots.length === 0) return;
    slots.forEach((slot) => {
      speak(`Darshan slot for ${slot.name} is ${slot.status}`, language);
    });

    const latest = slots[slots.length - 1];
    if (latest) {
      setSlotAlert(latest);
      if (slotAlertTimerRef.current) clearTimeout(slotAlertTimerRef.current);
      slotAlertTimerRef.current = setTimeout(() => setSlotAlert(null), 7000);
    }

    return () => {
      if (slotAlertTimerRef.current) clearTimeout(slotAlertTimerRef.current);
    };
  }, [slots, language]);

  const dismissSlotAlert = () => {
    setSlotAlert(null);
    if (slotAlertTimerRef.current) clearTimeout(slotAlertTimerRef.current);
  };

  const handleRouteClick = (route) => {
    const infoMsg = `${route.name}. ${route.info}. ${route.wheelchair ? "This path is wheelchair accessible." : "This path may have stairs or slopes."} Crowd level is ${["low", "medium", "high"][route.density] || "unknown"}.`;
    speak(infoMsg, language);
    setActiveRoute(route);
    setSelectedRoute(route);
    navigator.vibrate?.(50);
    try { mapRef.current?.panTo({ lat: route.coords[0], lng: route.coords[1] }); } catch (err) {}
  };

  const handleEmergencyClick = () => {
    stopSpeaking();
    speak("Emergency! Please follow the nearest exit immediately.", language);
    alert("🚨 Emergency Alert! Security has been notified.");
    navigator.vibrate?.(200);
    setActiveRoute(null);
    setSelectedRoute(null);
  };

  const onMapLoad = (map) => { mapRef.current = map; };

  const getMarkerIcon = (route) => {
    const colors = ["green", "yellow", "red"];
    const color = colors[route.density] || "red";
    return `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;
  };

  const isPriority = (route) => priorityRoutes.some((r) => r.name === route.name);

  useImperativeHandle(ref, () => ({
    navigateToRoute(route) {
      const matched = [...routes, ...priorityRoutes].find(r => r.name.toLowerCase() === route.name.toLowerCase());
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

      {slotAlert && (
        <div role="status" aria-live="polite" style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: "#FFD54F", color: "#000", padding: "10px 16px", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", display: "flex", gap: 12, alignItems: "center", maxWidth: "90%" }}>
          <div style={{ fontWeight: 600 }}>📢 {slotAlert.name}</div>
          <div style={{ opacity: 0.9 }}>{slotAlert.status}</div>
          <button onClick={dismissSlotAlert} aria-label="Dismiss slot alert" style={{ marginLeft: "auto", background: "transparent", border: "none", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
      )}

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={17} onLoad={onMapLoad}>
          {[...routes, ...priorityRoutes].map((route) => (
            <Marker key={route.id} position={{ lat: route.coords[0], lng: route.coords[1] }} onClick={() => handleRouteClick(route)} icon={{ url: getMarkerIcon(route) }} title={`${route.name}${isPriority(route) ? " - Priority Access" : ""}${route.wheelchair ? " ♿" : ""}`} />
          ))}

          {selectedRoute && (
            <>
              <InfoWindow position={{ lat: selectedRoute.coords[0], lng: selectedRoute.coords[1] }} onCloseClick={() => setSelectedRoute(null)}>
                <div style={{ minWidth: 180 }}>
                  <strong>{selectedRoute.name}</strong>
                  <p style={{ margin: "6px 0" }}>{selectedRoute.info}</p>
                  {isPriority(selectedRoute) && <p style={{ margin: "6px 0" }}>🚨 Priority Access</p>}
                  {selectedRoute.wheelchair && <p style={{ margin: "6px 0" }}>♿ Wheelchair-Friendly</p>}
                  <p style={{ marginTop: 6 }}>Crowd Density: <strong>{["Low","Medium","High"][selectedRoute.density] || "Unknown"}</strong></p>
                </div>
              </InfoWindow>

              <Circle center={{ lat: selectedRoute.coords[0], lng: selectedRoute.coords[1] }} radius={pulseRadius} options={{ strokeColor: isPriority(selectedRoute) ? "green" : "red", strokeOpacity: 0.8, strokeWeight: 2, fillColor: isPriority(selectedRoute) ? "green" : "red", fillOpacity: 0.12, clickable: false, draggable: false, visible: true }} />
            </>
          )}
        </GoogleMap>
      </LoadScript>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button className="sos-button p-3 rounded bg-red-600 text-white" onClick={handleEmergencyClick} aria-label="Emergency SOS">
          🚨 SOS / Emergency
        </button>
      </div>

      <audio ref={audioRef} src={beepSound} preload="auto" />
    </div>
  );
});

export default Accessibility;
