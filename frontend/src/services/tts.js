// src/services/tts.js

let currentUtterance = null;

export function speak(text, lang = "en-US") {
  // Wrap the speech synthesis in a Promise
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      console.warn("TTS not supported");
      resolve(); // Resolve the promise even if TTS is not supported
      return;
    }

    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = lang;

    // When the speech ends, resolve the promise
    currentUtterance.onend = () => {
      currentUtterance = null;
      resolve();
    };

    // If there's an error, reject the promise
    currentUtterance.onerror = (event) => {
      console.error("SpeechSynthesisUtterance.onerror", event);
      currentUtterance = null;
      reject(event);
    };

    window.speechSynthesis.speak(currentUtterance);
  });
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}