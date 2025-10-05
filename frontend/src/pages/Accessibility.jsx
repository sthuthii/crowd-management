import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Accessibility() {
  const [info, setInfo] = useState({});

  const fetchAccessibility = async () => {
    try {
      const resp = await api.get("/accessibility/accessibility");
      setInfo(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAccessibility();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Accessibility Information</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Location</th>
            <th>Ramps</th>
            <th>Priority Entrance</th>
            <th>Accessible Restroom</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(info).map((loc) => (
            <tr key={loc}>
              <td>{loc}</td>
              <td>{info[loc].ramps ? "Yes" : "No"}</td>
              <td>{info[loc].priority_entrance ? "Yes" : "No"}</td>
              <td>{info[loc].accessible !== undefined ? (info[loc].accessible ? "Yes" : "No") : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
