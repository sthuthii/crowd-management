import { useEffect, useState } from "react";
import apiClient from "../ApiClient";
import Navbar from "../components/Navbar";

export default function Queues() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiClient.get("api/queues").then((res) => setQueues(res.data));
  }, []);

  const bookPass = async (queueId) => {
    setLoading(true);
    try {
      const res = await apiClient.post("api/passes", { queue_id: queueId });
      setMessage(`Pass booked successfully: ${res.data.pass_id}`);
    } catch (err) {
      setMessage("Failed to book pass. You may already have one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Available Queues</h2>
        {queues.map((q) => (
          <div key={q.id} className="border p-4 rounded mb-3 shadow-sm">
            <h3 className="font-semibold">{q.name}</h3>
            <p>Wait Time: {q.wait_time_minutes} mins</p>
            <p>Status: {q.status}</p>
            <button
              onClick={() => bookPass(q.id)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Pass"}
            </button>
          </div>
        ))}
        {message && <p className="mt-4 text-blue-600">{message}</p>}
      </div>
    </div>
  );
}
