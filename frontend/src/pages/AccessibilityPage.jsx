import React, { useRef, useState, useEffect } from "react";
import Accessibility from "./Accessibility";
import AccessibilityMenu from "./AccessibilityMenu";
import { speak } from "../services/tts";

export default function AccessibilityPage() {
  const accessibilityRef = useRef(null);
  const [textSize, setTextSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    speak(
      "Welcome to the smart crowd management system. Use the menu to adjust settings or start voice commands.",
      language
    );
  }, [language]);

  const handleTextResize = (size) => setTextSize(size);
  const handleContrastToggle = () => setHighContrast((prev) => !prev);
  const handleSpeak = (message, lang = language) => speak(message, lang);
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    speak(
      `Language changed to ${
        newLang === "hi-IN"
          ? "Hindi"
          : newLang === "ta-IN"
          ? "Tamil"
          : newLang === "gu-IN"
          ? "Gujarati"
          : "English"
      }`,
      newLang
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "250px" : "40px",
          transition: "width 0.3s",
          background: "#620b0bff",
          overflow: "hidden",
        }}
      >
        {sidebarOpen ? (
          <div style={{ padding: "16px" }}>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ marginBottom: "16px" }}
            >
              Minimize
            </button>

            {/* Text Size */}
            <div style={{ marginBottom: "16px" }}>
              <span>Text Size: </span>
              <button onClick={() => handleTextResize(Math.max(12, textSize - 2))}>
                A-
              </button>
              <span>{textSize}px</span>
              <button onClick={() => handleTextResize(Math.min(32, textSize + 2))}>
                A+
              </button>
            </div>

            {/* High Contrast */}
            <div style={{ marginBottom: "16px" }}>
              <label>
                High Contrast:
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={handleContrastToggle}
                  style={{ marginLeft: "8px" }}
                />
              </label>
            </div>

            {/* Language */}
            <div style={{ marginBottom: "16px" }}>
              <label>
                Language:
                <select value={language} onChange={handleLanguageChange} style={{ marginLeft: "8px" }}>
                  <option value="en-US">English</option>
                  <option value="hi-IN">Hindi</option>
                  <option value="ta-IN">Tamil</option>
                  <option value="gu-IN">Gujarati</option>
                </select>
              </label>
            </div>

            <AccessibilityMenu
              onTextResize={handleTextResize}
              onContrastToggle={handleContrastToggle}
              onSpeak={handleSpeak}
              onNavigateRoute={() => {}}
              onStopNavigation={() => {}}
              language={language}
            />
          </div>
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              width: "40px",
              height: "100%",
              background: "#000000ff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        <Accessibility
          ref={accessibilityRef}
          textSize={textSize}
          highContrast={highContrast}
          language={language}
        />
      </div>
    </div>
  );
}
