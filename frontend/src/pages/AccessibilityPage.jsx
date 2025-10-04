import React, { useRef, useState, useEffect } from "react";
import Accessibility from "./Accessibility";
import AccessibilityMenu from "./AccessibilityMenu";
import { speak, stopSpeaking } from "../services/tts";
import "../styles/AccessibilityPage.css";

export default function AccessibilityPage() {
  const accessibilityRef = useRef(null);
  const [textSize, setTextSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState("en-US");

  useEffect(() => {
    speak("Welcome to the smart crowd management system. Use the menu to adjust settings or start voice commands.", language);
  }, [language]);

  const handleTextResize = size => setTextSize(size);
  const handleContrastToggle = () => setHighContrast(prev => !prev);
  const handleSpeak = (message, lang = language) => speak(message, lang);
  const handleNavigateRoute = routeName => accessibilityRef.current?.navigateToRoute({ name: routeName });
  const handleStopNavigation = () => accessibilityRef.current?.stopNavigation();

  const handleLanguageChange = e => {
    const newLang = e.target.value;
    setLanguage(newLang);
    speak(`Language changed to ${newLang === "hi-IN" ? "Hindi" : newLang === "ta-IN" ? "Tamil" : newLang === "gu-IN" ? "Gujarati" : "English"}`, newLang);
  };

  return (
    <div className={`page-container ${highContrast ? "high-contrast" : ""}`} style={{ fontSize: `${textSize}px`, height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="menu-container" style={{ padding: "16px", background: "#f0f0f0" }}>
        <div className="language-selector mb-4">
          <label htmlFor="language" className="font-semibold mr-2">Language:</label>
          <select id="language" value={language} onChange={handleLanguageChange} className="p-2 rounded border">
            <option value="en-US">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="ta-IN">Tamil</option>
            <option value="gu-IN">Gujarati</option>
          </select>
        </div>

        <AccessibilityMenu
          onTextResize={handleTextResize}
          onContrastToggle={handleContrastToggle}
          onSpeak={handleSpeak}
          onNavigateRoute={handleNavigateRoute}
          onStopNavigation={handleStopNavigation}
          language={language}
        />
      </div>

      <div className="map-container" style={{ flex: 1 }}>
        <Accessibility ref={accessibilityRef} textSize={textSize} highContrast={highContrast} language={language} />
      </div>
    </div>
  );
}
