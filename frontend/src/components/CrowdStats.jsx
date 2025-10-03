import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function CrowdStats() {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const resp = await api.get("/crowd/count");
      setCount(resp.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Crowd Count</h3>
      <h1>{count}</h1>
    </div>
  );
}
