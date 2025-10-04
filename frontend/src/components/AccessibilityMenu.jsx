import React, { useState, useEffect } from "react";
import axios from "axios";
import { speak, stopSpeaking } from "../services/tts";


export default function AccessibilityMenu({
  onTextResize,
  onContrastToggle,
  onSpeak,
  onNavigateRoute,
  onStopNavigation,
  language: defaultLang = "en-US"
}) {
  const [textSize, setTextSize] = useState(16);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [routesList, setRoutesList] = useState([]);
  const [language, setLanguage] = useState(defaultLang);
  const [slots, setSlots] = useState([]);

  // Fetch all routes dynamically from backend
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const [accessRes, priorityRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/accessibility/accessibility"),
          axios.get("http://127.0.0.1:8000/priority/priority/")
        ]);

        const accessRoutes = Object.keys(accessRes.data);
        const priorityRoutes = priorityRes.data.map(r => r.name);
        setRoutesList([...accessRoutes, ...priorityRoutes]);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, []);

  // Fetch darshan slots for voice commands
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/darshan-slots");
        setSlots(res.data);
      } catch (err) {
        console.error("Error fetching darshan slots:", err);
      }
    };
    fetchSlots();
  }, []);

  // Setup voice recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
    console.log("Voice command:", command);

    if (command.includes("increase text")) increaseText();
    else if (command.includes("decrease text")) decreaseText();
    else if (command.includes("reset text")) resetText();
    else if (command.includes("contrast")) onContrastToggle();

    else if (command.includes("read welcome")) {
      onSpeak("Welcome to the crowd management system. Please follow the instructions.", language);
    }
    else if (command.includes("go to")) {
      const matchedRoute = routesList.find(route =>
        command.includes(route.toLowerCase()) ||
        route.toLowerCase().includes(command.replace("go to", "").trim())
      );
      if (matchedRoute) onNavigateRoute(matchedRoute);
    }
    else if (command.includes("stop navigation") || command.includes("cancel navigation")) {
      onStopNavigation?.();
      onSpeak("Navigation stopped.", language);
    }

    else if (command.includes("emergency") || command.includes("sos")) {
      onSpeak("Emergency activated. Security has been notified. Please stay calm.", language);
      alert("🚨 Emergency Alert Triggered!");
      navigator.vibrate?.(200);
    }

    else if (command.includes("darshan slot") || command.includes("queue update")) {
      if (slots.length > 0) {
        slots.forEach(slot => onSpeak(`Darshan slot for ${slot.name} is ${slot.status}`, language));
      } else {
        onSpeak("No darshan slot information available right now.", language);
      }
    }

    else if (command.includes("hindi")) setLanguage("hi-IN");
    else if (command.includes("tamil")) setLanguage("ta-IN");
    else if (command.includes("english")) setLanguage("en-US");
  };

  const toggleListening = () => {
    if (!recognition) return alert("Voice recognition not supported in this browser.");
    if (!listening) {
      recognition.start();
      setListening(true);
      navigator.vibrate?.(50);
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
    <div className="accessibility-menu p-4 bg-gray-100 rounded-lg shadow-md flex flex-col gap-3">
      <h2 className="text-lg font-bold">Accessibility Options</h2>

      <div>
        <button onClick={increaseText} className="p-2 bg-blue-500 text-white rounded mr-2">A+</button>
        <button onClick={decreaseText} className="p-2 bg-blue-500 text-white rounded mr-2">A-</button>
        <button onClick={resetText} className="p-2 bg-blue-500 text-white rounded">Reset</button>
      </div>

      <button onClick={onContrastToggle} className="p-2 bg-black text-white rounded">
        Toggle High Contrast
      </button>

      <div className="flex gap-2">
        <button onClick={() => setLanguage("en-US")} className="p-2 bg-gray-700 text-white rounded">English</button>
        <button onClick={() => setLanguage("hi-IN")} className="p-2 bg-orange-600 text-white rounded">हिंदी</button>
        <button onClick={() => setLanguage("ta-IN")} className="p-2 bg-pink-600 text-white rounded">தமிழ்</button>
      </div>

      <button
        onClick={() => onSpeak("Welcome to the crowd management system. Please follow the instructions.", language)}
        className="p-2 bg-green-600 text-white rounded"
      >
        🔊 Read Welcome Message
      </button>

      <button
        onClick={toggleListening}
        className={`p-2 rounded text-white ${listening ? "bg-red-500" : "bg-yellow-500"}`}
      >
        {listening ? "🛑 Stop Voice Command" : "🎤 Start Voice Command"}
      </button>
    </div>
  );
}
