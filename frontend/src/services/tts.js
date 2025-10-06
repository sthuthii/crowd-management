// src/services/tts.js

let currentUtterance = null;

export function speak(text, lang = "en-US") {
  if (!("speechSynthesis" in window)) return console.warn("TTS not supported");

  // Cancel any ongoing speech before starting new
  if (currentUtterance) window.speechSynthesis.cancel();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = lang;

  currentUtterance.onend = () => {
    currentUtterance = null;
  };

  window.speechSynthesis.speak(currentUtterance);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}
