import React from "react";
import useQueues from "../hooks/useQueues";

export default function QueueManagement({ language }) {
  const { queues, joinQueue, serveNext } = useQueues(language);

  return (
    <div className="queue-management p-4">
      {Object.entries(queues).map(([location, counts]) => (
        <div key={location} className="mb-4 p-3 border rounded shadow-sm">
          <h2 className="font-semibold mb-2">{location}</h2>
          <div className="flex gap-4 mb-2">
            <div>Normal: {counts.normal}</div>
            <div>Priority: {counts.priority}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => joinQueue(location, "normal")}>
              Join Normal Queue
            </button>
            <button onClick={() => joinQueue(location, "priority")}>
              Join Priority Queue
            </button>
            <button onClick={() => serveNext(location, "normal")}>
              Serve Next (Normal)
            </button>
            <button onClick={() => serveNext(location, "priority")}>
              Serve Next (Priority)
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
