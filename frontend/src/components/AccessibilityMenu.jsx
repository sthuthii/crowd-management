import React, { useState, useEffect } from "react";

export default function AccessibilityMenu({ onTextResize, onContrastToggle, onSpeak, onNavigateRoute, onStopNavigation }) {
  const [textSize, setTextSize] = useState(16);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const routesList = [
    "Main Entrance to Darshan Hall",
    "Ramp to Temple Garden",
    "Accessible Restroom",
    "Prayer Hall Ramp"
  ];

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.lang = "en-US";

    recog.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase();
      handleVoiceCommand(command);
    };

    recog.onend = () => {
      // Auto-restart recognition if still listening
      if (listening) recog.start();
    };

    setRecognition(recog);
  }, [listening]);

  const handleVoiceCommand = (command) => {
    console.log("Voice command:", command);

    if (command.includes("increase text")) increaseText();
    else if (command.includes("decrease text")) decreaseText();
    else if (command.includes("reset text")) resetText();
    else if (command.includes("high contrast")) onContrastToggle();
    else if (command.includes("read welcome")) {
      onSpeak("Welcome to the crowd management system. Please follow the instructions.");
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
      onSpeak("Navigation stopped.");
    }
  };

  const toggleListening = () => {
    if (!recognition) return alert("Voice recognition not supported in this browser.");
    if (!listening) {
      recognition.start();
      setListening(true);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  const increaseText = () => {
    const newSize = textSize + 2;
    setTextSize(newSize);
    onTextResize(newSize);
  };

  const decreaseText = () => {
    const newSize = textSize - 2;
    setTextSize(newSize);
    onTextResize(newSize);
  };

  const resetText = () => {
    setTextSize(16);
    onTextResize(16);
  };

  return (
    <div className="accessibility-menu p-4 bg-gray-100 rounded-lg shadow-md flex flex-col gap-2">
      <h2 className="text-lg font-bold">Accessibility Options</h2>

      {/* Text Size Controls */}
      <div>
        <button onClick={increaseText} className="p-2 bg-blue-500 text-white rounded mr-2">A+</button>
        <button onClick={decreaseText} className="p-2 bg-blue-500 text-white rounded mr-2">A-</button>
        <button onClick={resetText} className="p-2 bg-blue-500 text-white rounded">Reset</button>
      </div>

      {/* High Contrast */}
      <button onClick={onContrastToggle} className="p-2 bg-black text-white rounded">
        Toggle High Contrast
      </button>

      {/* Welcome Message */}
      <button
        onClick={() => onSpeak("Welcome to the crowd management system. Please follow the instructions.")}
        className="p-2 bg-green-600 text-white rounded"
      >
        🔊 Read Welcome Message
      </button>

      {/* Voice Command Toggle */}
      <button
        onClick={toggleListening}
        className={`p-2 rounded text-white ${listening ? "bg-red-500" : "bg-yellow-500"}`}
      >
        {listening ? "🛑 Stop Voice Command" : "🎤 Start Voice Command"}
      </button>
    </div>
  );
}
