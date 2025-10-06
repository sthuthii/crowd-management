import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { speak } from "../services/tts";

export default function useQueues(language = "en-US") {
  const [queues, setQueues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevQueuesRef = useRef({});
  const speechQueueRef = useRef([]);
  const isSpeakingRef = useRef(false);

  // Thresholds for friendly alerts
  const thresholdBusy = 5;
  const thresholdFull = 10;

  const fetchQueues = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/queue/");
      const newQueues = res.data || {};
      setQueues(newQueues);

      // Announce changes & busy/full alerts
      Object.keys(newQueues).forEach((loc) => {
        const prev = prevQueuesRef.current[loc] || { normal: 0, priority: 0 };
        const curr = newQueues[loc];

        // Announce normal/priority changes
        if (prev.normal !== curr.normal) {
          enqueueSpeech(`${loc} normal queue is now ${curr.normal}`);
        }
        if (prev.priority !== curr.priority) {
          enqueueSpeech(`${loc} priority queue is now ${curr.priority}`);
        }

        // Announce if queue is busy or full
        if (
          (prev.normal < thresholdBusy && curr.normal >= thresholdBusy) ||
          (prev.priority < thresholdBusy && curr.priority >= thresholdBusy)
        ) {
          enqueueSpeech(`${loc} is getting busy. Expect some wait time.`);
        }
        if (
          (prev.normal < thresholdFull && curr.normal >= thresholdFull) ||
          (prev.priority < thresholdFull && curr.priority >= thresholdFull)
        ) {
          enqueueSpeech(`${loc} is full. Please wait or try another location.`);
        }
      });

      prevQueuesRef.current = newQueues;
      setError(null);
    } catch (err) {
      console.error("Error fetching queues:", err.response || err);
      setError("Failed to fetch queue data. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  const enqueueSpeech = (text) => {
    speechQueueRef.current.push(text);
    speakNext();
  };

  const speakNext = () => {
    if (isSpeakingRef.current) return;
    if (speechQueueRef.current.length === 0) return;

    const text = speechQueueRef.current.shift();
    isSpeakingRef.current = true;

    speak(text, language)
      .finally(() => {
        isSpeakingRef.current = false;
        setTimeout(() => speakNext(), 200); // small delay between messages
      });
  };

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 5000);
    return () => clearInterval(interval);
  }, []);

  const joinQueue = async (location, type) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/queue/join", { location, type });
      enqueueSpeech(`You joined the ${type} queue at ${location}`);
      fetchQueues();
      return res.data;
    } catch (err) {
      console.error("Join queue error:", err.response || err);
      setError("Failed to join queue");
      return null;
    }
  };

  const serveNext = async (location, type) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/queue/serve", { location, type });
      enqueueSpeech(`Next person served from ${type} queue at ${location}`);
      fetchQueues();
      return res.data;
    } catch (err) {
      console.error("Serve next error:", err.response || err);
      setError("Failed to serve next person");
      return null;
    }
  };

  return { queues, loading, error, joinQueue, serveNext };
}
