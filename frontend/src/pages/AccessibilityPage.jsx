import React, { useState, useEffect } from "react";
import Accessibility from "./Accessibility";
import AccessibilityMenu from "./AccessibilityMenu";
import { speak } from "../services/tts";

// Import the CSS Module file
import styles from "./AccessibilityPage.module.css";

// You can use an icon library like 'react-icons' for better UI
// For example: import { FaSun, FaMoon, FaGlobe } from 'react-icons/fa';

export default function AccessibilityPage() {
  const [textSize, setTextSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    speak(
      "Welcome to the accessibility page. Use the sidebar to adjust settings.",
      language
    );
  }, [language]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    // ... speech logic remains the same
  };

  // The main container will now apply a high-contrast class when toggled
  const pageContainerClass = `${styles.pageContainer} ${highContrast ? styles.highContrast : ''}`;

  return (
    <div className={styles.pageContainerClass}>
      {/* Sidebar using CSS classes */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarContent}>
          <h2 className={styles.sidebarTitle}>Settings</h2>

          {/* Text Size Control */}
          <div className={styles.controlGroup}>
            <label>Text Size</label>
            <div className={styles.buttonGroup}>
              <button onClick={() => setTextSize(Math.max(12, textSize - 2))}>A-</button>
              <span>{textSize}px</span>
              <button onClick={() => setTextSize(Math.min(32, textSize + 2))}>A+</button>
            </div>
          </div>

          {/* High Contrast Control */}
          <div className={styles.controlGroup}>
            <label>High Contrast</label>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={() => setHighContrast(prev => !prev)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {/* Language Control */}
          <div className={styles.controlGroup}>
            <label>Language</label>
            <select value={language} onChange={handleLanguageChange}>
              <option value="en-US">English</option>
              <option value="hi-IN">Hindi</option>
              <option value="ta-IN">Tamil</option>
              <option value="gu-IN">Gujarati</option>
            </select>
          </div>

          {/* This component can also be styled via props or its own CSS */}
          <AccessibilityMenu language={language} />
        </div>

        <button
          className={styles.toggleButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {sidebarOpen ? "‹" : "›"}
        </button>
      </aside>

      {/* Main content */}
      <main className={styles.mainContent}>
        <Accessibility
          textSize={textSize}
          highContrast={highContrast}
          language={language}
        />
      </main>
    </div>
  );
}