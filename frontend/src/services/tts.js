// src/services/tts.js

export function speak(text, lang = "en-US") {
  if (!("speechSynthesis" in window)) return console.warn("TTS not supported");

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
