import { useState, useEffect, useRef } from "react";
import axios from "axios";
// I've removed the import for the 'speak' service as it's no longer needed.

export default function useQueues(language = "en-US") {
  const [queues, setQueues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevQueuesRef = useRef({});
  // Speech-related refs are no longer needed.

  const fetchQueues = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/queue/");
      const newQueues = res.data || {};
      setQueues(newQueues);

      // All speech-related logic has been removed from here.

      prevQueuesRef.current = newQueues;
      setError(null);
    } catch (err) {
      console.error("Error fetching queues:", err.response || err);
      setError("Failed to fetch queue data. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  // The 'enqueueSpeech' and 'speakNext' functions have been removed.

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 5000);
    return () => clearInterval(interval);
  }, []);

  const joinQueue = async (location, type) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/queue/join", { location, type });
      // The call to enqueueSpeech has been removed.
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
      // The call to enqueueSpeech has been removed.
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