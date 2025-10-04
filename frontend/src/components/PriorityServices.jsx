import React from "react";

const PriorityServices = ({ queues }) => {
  return (
    <div>
      <h3>Priority Services</h3>
      <ul>
        {queues.map((queue, idx) => (
          <li key={idx}>
            {queue.name} - {queue.status}
            {queue.isPriority && <span style={{ color: "green", marginLeft: "8px" }}>⭐ Priority</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PriorityServices;
