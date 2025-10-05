import React from "react";
import { Bar } from "react-chartjs-2";
import useQueues from "../hooks/useQueues";
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

export default function QueueStats({ language }) {
  const { queues, loading, error } = useQueues(language);

  const locations = Object.keys(queues || {});
  const normalCounts = locations.map((loc) => queues[loc]?.normal || 0);
  const priorityCounts = locations.map((loc) => queues[loc]?.priority || 0);

  const data = {
    labels: locations.length ? locations : ["No Data"],
    datasets: [
      {
        label: "Normal Queue",
        data: normalCounts.length ? normalCounts : [0],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Priority Queue",
        data: priorityCounts.length ? priorityCounts : [0],
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

  if (loading) return <p style={{ textAlign: "center" }}>Loading queues...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  if (!locations.length) return <p style={{ textAlign: "center" }}>No queue data available</p>;

  return <Bar data={data} options={options} />;
}
