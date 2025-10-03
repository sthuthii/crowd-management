import React from "react";
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

export default function TrafficFlow({ traffic }) {
  const locations = Object.keys(traffic || {});
  const pedestrianCounts = locations.map((loc) => traffic[loc]?.pedestrians || 0);
  const vehicleCounts = locations.map((loc) => traffic[loc]?.vehicles || 0);

  const data = {
    labels: locations,
    datasets: [
      {
        label: "Pedestrians",
        data: pedestrianCounts,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Vehicles",
        data: vehicleCounts,
        backgroundColor: "rgba(255, 159, 64, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Traffic Flow by Location" },
    },
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <Bar data={data} options={options} />
    </div>
  );
}
