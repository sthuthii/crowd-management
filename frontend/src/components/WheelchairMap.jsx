import React, { useEffect, useState } from "react";

const WheelchairMap = ({ start, end }) => {
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (!window.google) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: window.google.maps.TravelMode.WALKING,
        drivingOptions: {
          avoidFerries: true
        },
        provideRouteAlternatives: true
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  }, [start, end]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      {directions ? (
        <iframe
          title="Wheelchair Route"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_API_KEY&origin=${start}&destination=${end}&mode=walking&avoid=ferries`}
        ></iframe>
      ) : (
        <p>Loading wheelchair-friendly route...</p>
      )}
    </div>
  );
};

export default WheelchairMap;
