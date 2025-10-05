import React, { useEffect, useRef } from "react";
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
  const alertRef = useRef(false); // prevent overlapping speech

  // Friendly alerts for older users
  useEffect(() => {
    const thresholdBusy = 5;
    const thresholdFull = 10;

    if (!queues || alertRef.current) return;

    Object.entries(queues).forEach(([loc, q]) => {
      let message = "";
      if (q.priority >= thresholdFull || q.normal >= thresholdFull) {
        message = `${loc} is full. Please wait or try another location.`;
      } else if (q.priority >= thresholdBusy || q.normal >= thresholdBusy) {
        message = `${loc} is getting busy. Expect some wait time.`;
      }

      if (message) {
        alertRef.current = true;
        const speech = new SpeechSynthesisUtterance(message);
        speech.lang = "en-IN";
        speech.pitch = 1;
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);
        speech.onend = () => setTimeout(() => (alertRef.current = false), 1000);
      }
    });
  }, [queues]);

  const locations = Object.keys(queues || {});
  const normalCounts = locations.map((loc) => queues[loc]?.normal || 0);
  const priorityCounts = locations.map((loc) => queues[loc]?.priority || 0);

  const data = {
    labels: locations.length ? locations : ["No Data"],
    datasets: [
      {
        label: "Normal Queue",
        data: normalCounts.length ? normalCounts : [0],
        backgroundColor: normalCounts.map((count) =>
          count >= 10 ? "#ff4d4f" : count >= 5 ? "#faad14" : "#52c41a"
        ),
      },
      {
        label: "Priority Queue",
        data: priorityCounts.length ? priorityCounts : [0],
        backgroundColor: priorityCounts.map((count) =>
          count >= 10 ? "#ff4d4f" : count >= 5 ? "#faad14" : "#52c41a"
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { font: { size: 16 } } },
      title: { display: true, text: "Queue Lengths by Location", font: { size: 20 } },
      tooltip: { bodyFont: { size: 16 } },
    },
    scales: {
      y: { ticks: { font: { size: 14 } } },
      x: { ticks: { font: { size: 14 } } },
    },
  };

  if (loading) return <p style={{ textAlign: "center", fontSize: 18 }}>Loading queues...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", fontSize: 18 }}>{error}</p>
    );
  if (!locations.length)
    return <p style={{ textAlign: "center", fontSize: 18 }}>No queue data available</p>;

  return <Bar data={data} options={options} />;
}
