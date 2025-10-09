// src/pages/MyPassPage.jsx
import React, { useEffect, useState } from "react";
import apiClient from "../ApiClient";

const MyPassPage = () => {
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/passes") // fetch all passes from fake_passes
      .then((res) => {
        // pick the latest pass for demonstration
        const latestPass = res.data.length ? res.data[res.data.length - 1] : null;
        setPass(latestPass);
      })
      .catch((err) => console.error("Error fetching pass:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading your pass...
      </div>
    );
  }

  if (!pass) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        No active passes found.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
          🎟️ Your Pass Details
        </h2>
        <p className="text-gray-700 mb-2">
          <strong>Queue Number:</strong> {pass.queue_number}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Issued At:</strong> {pass.issued_time}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Status:</strong> {pass.status}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>User:</strong> {pass.user_name}
        </p>
      </div>
    </div>
  );
};

export default MyPassPage;
