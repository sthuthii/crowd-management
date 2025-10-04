import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { speak } from "../services/tts";

export default function useQueues(language = "en-US") {
  const [queues, setQueues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevQueuesRef = useRef({}); // track previous counts for TTS

  // Fetch queues from backend
  const fetchQueues = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/queue/");
      const newQueues = res.data || {};
      setQueues(newQueues);

      // TTS: announce only changes
      Object.keys(newQueues).forEach((loc) => {
        const prev = prevQueuesRef.current[loc] || { normal: 0, priority: 0 };
        const curr = newQueues[loc];

        if (prev.normal !== curr.normal) {
          speak(`${loc} normal queue is now ${curr.normal}`, language);
        }
        if (prev.priority !== curr.priority) {
          speak(`${loc} priority queue is now ${curr.priority}`, language);
        }
      });

      prevQueuesRef.current = newQueues;
      setError(null);
    } catch (err) {
      console.error("Error fetching queues:", err);
      setError("Failed to fetch queue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 5000);
    return () => clearInterval(interval);
  }, []);

  // Join queue
  const joinQueue = async (location, type) => {
    try {
      await axios.post("http://127.0.0.1:8000/queue/join", { location, type });
      speak(`You joined the ${type} queue at ${location}`, language);
      fetchQueues();
    } catch (err) {
      console.error(err);
      setError("Failed to join queue");
    }
  };

  // Serve next person
  const serveNext = async (location, type) => {
    try {
      await axios.post("http://127.0.0.1:8000/queue/serve", { location, type });
      speak(`Next person served from ${type} queue at ${location}`, language);
      fetchQueues();
    } catch (err) {
      console.error(err);
      setError("Failed to serve next person");
    }
  };

  return { queues, loading, error, joinQueue, serveNext };
}
