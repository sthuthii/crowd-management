// frontend/src/components/MapView.jsx
import React from "react";

export default function MapView({ center = [13.0827, 80.2707], height = 400 }) {
  const [lat, lon] = center;
  // create a small bounding box around center for the OSM embed
  const latDelta = 0.03;
  const lonDelta = 0.03;
  const lonMin = (lon - lonDelta).toFixed(5);
  const latMin = (lat - latDelta).toFixed(5);
  const lonMax = (lon + lonDelta).toFixed(5);
  const latMax = (lat + latDelta).toFixed(5);
  const bbox = `${lonMin},${latMin},${lonMax},${latMax}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
      <iframe
        title="map"
        src={src}
        style={{ width: "100%", height }}
        frameBorder="0"
      />
    </div>
  );
}
