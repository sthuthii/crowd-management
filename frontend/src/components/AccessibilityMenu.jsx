import React, { useState, useEffect } from "react";
import axios from "axios";
import { speak } from "../services/tts";

export default function AccessibilityMenu({
  onTextResize,
  onContrastToggle,
  onSpeak,
  onNavigateRoute,
  onStopNavigation,
  language: defaultLang = "en-US",
}) {
  const [textSize, setTextSize] = useState(16);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [routesList, setRoutesList] = useState([]);
  const [language, setLanguage] = useState(defaultLang);
  const [expanded, setExpanded] = useState(false);

  // Fetch routes
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const [accessRes, priorityRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/accessibility/accessibility"),
          axios.get("http://127.0.0.1:8000/priority/"),
        ]);
        const accessRoutes = Object.keys(accessRes.data);
        const priorityRoutes = priorityRes.data.map((r) => r.name);
        setRoutesList([...accessRoutes, ...priorityRoutes]);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, []);

  // I have removed the useEffect hook that was trying to fetch /darshan-slots
  // as that endpoint does not exist and was causing a 404 error.

  // Voice recognition setup
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window))
      return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.lang = language;

    recog.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase();
      handleVoiceCommand(command);
    };

    recog.onend = () => {
      if (listening) recog.start();
    };

    setRecognition(recog);
  }, [listening, language, routesList]);

  const handleVoiceCommand = (command) => {
    if (command.includes("increase text")) increaseText();
    else if (command.includes("decrease text")) decreaseText();
    else if (command.includes("reset text")) resetText();
    else if (command.includes("contrast")) onContrastToggle();
    else if (command.includes("read welcome")) {
      onSpeak(
        "Welcome to the crowd management system. Please follow the instructions.",
        language
      );
    }
    else if (command.includes("go to")) {
      const matchedRoute = routesList.find(
        (route) =>
          command.includes(route.toLowerCase()) ||
          route.toLowerCase().includes(command.replace("go to", "").trim())
      );
      if (matchedRoute) onNavigateRoute(matchedRoute);
    }
    else if (
      command.includes("stop navigation") ||
      command.includes("cancel navigation")
    ) {
      onStopNavigation?.();
      onSpeak("Navigation stopped.", language);
    }
  };

  const toggleListening = () => {
    if (!recognition) return alert("Voice recognition not supported.");
    if (!listening) {
      recognition.start();
      setListening(true);
      speak("Voice command activated.", language);
    } else {
      recognition.stop();
      setListening(false);
      speak("Voice command deactivated.", language);
    }
  };

  const increaseText = () => {
    const newSize = textSize + 2;
    setTextSize(newSize);
    onTextResize(newSize);
    speak("Text size increased.", language);
  };

  const decreaseText = () => {
    const newSize = textSize - 2;
    setTextSize(newSize);
    onTextResize(newSize);
    speak("Text size decreased.", language);
  };

  const resetText = () => {
    setTextSize(16);
    onTextResize(16);
    speak("Text size reset to default.", language);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: expanded ? "260px" : "60px",
        height: expanded ? "auto" : "60px",
        background: "#f0f0f0",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        padding: expanded ? "16px" : "0",
        transition: "all 0.3s ease",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <button
        onClick={() => setExpanded((prev) => !prev)}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
        }}
      >
        {expanded ? "⇦" : "☰"}
      </button>

      {expanded && (
        <>
          <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: "8px 0" }}>
            Accessibility
          </h2>

          <div style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
            <button onClick={increaseText} style={btnStyle}>A+</button>
            <button onClick={decreaseText} style={btnStyle}>A-</button>
            <button onClick={resetText} style={btnStyle}>Reset</button>
          </div>

          <button onClick={onContrastToggle} style={btnStyle}>
            Toggle High Contrast
          </button>

          <div style={{ display: "flex", gap: "5px", marginTop: "5px", flexWrap: "wrap" }}>
            <button onClick={() => setLanguage("en-US")} style={btnStyle}>English</button>
            <button onClick={() => setLanguage("hi-IN")} style={btnStyle}>हिंदी</button>
            <button onClick={() => setLanguage("gu-IN")} style={btnStyle}>ગુજરાતી</button>
          </div>

          <button
            onClick={() =>
              onSpeak(
                "Welcome to the crowd management system. Please follow the instructions.",
                language
              )
            }
            style={btnStyle}
          >
            🔊 Read Welcome Message
          </button>

          <button
            onClick={toggleListening}
            style={{ ...btnStyle, background: listening ? "#dc3545" : "#ffc107" }}
          >
            {listening ? "🛑 Stop Voice Command" : "🎤 Start Voice Command"}
          </button>
        </>
      )}
    </div>
  );
}

const btnStyle = {
  padding: "6px 10px",
  borderRadius: "6px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
};