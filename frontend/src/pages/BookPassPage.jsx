// src/pages/BookPassPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../ApiClient";

const BookPassPage = () => {
  const { queueId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBookPass = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post("/api/passes"); // backend auto-creates a pass
      setMessage(`🎟️ Pass booked successfully! Queue Number: ${res.data.queue_number}`);
      setTimeout(() => navigate("/my-pass"), 1500);
    } catch (err) {
      setMessage("❌ Failed to book pass. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Book Your Pass</h2>
        <p className="text-gray-700 mb-6 text-center">
          You are booking for Queue ID: <strong>{queueId}</strong>
        </p>

        <button
          onClick={handleBookPass}
          disabled={loading}
          className={`w-full py-2 rounded-xl text-white font-semibold transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>

        {message && (
          <p className="text-center mt-4 text-green-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default BookPassPage;
