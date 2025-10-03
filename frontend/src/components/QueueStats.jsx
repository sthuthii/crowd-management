import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function QueueStats() {
  const [queues, setQueues] = useState({});

  const fetchQueues = async () => {
    try {
      const resp = await api.get("/queue/queues");
      setQueues(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 5000); // auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const locations = Object.keys(queues);
  const normalCounts = locations.map((loc) => queues[loc]?.normal || 0);
  const priorityCounts = locations.map((loc) => queues[loc]?.priority || 0);

  const data = {
    labels: locations,
    datasets: [
      {
        label: "Normal Queue",
        data: normalCounts,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Priority Queue",
        data: priorityCounts,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Queue Lengths by Location" },
    },
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <Bar data={data} options={options} />
    </div>
  );
}
