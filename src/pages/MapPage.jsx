// src/pages/MapPage.jsx
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAppContext } from "../AppContext.jsx";

// Optional: custom icons
const victimIcon = new L.Icon({
  iconUrl: "/victimIcon.jpg", // put a PNG in public folder
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -35],
});

const volunteerIcon = new L.Icon({
  iconUrl: "/volunteerIcon.jpg", // put a PNG in public folder
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -35],
});

export default function MapPage() {
  const { victims, volunteers } = useAppContext();

  useEffect(() => {
    // Initialize map
    const map = L.map("map", { zoomControl: false }).setView([20, 80], 5);
    L.control.zoom({ position: "topright" }).addTo(map);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Infection Zones (example)
    const infectionZones = [
      { coords: [28.7041, 77.1025], color: "red", popup: "High Infection - Delhi" },
      { coords: [19.0760, 72.8777], color: "orange", popup: "Medium Infection - Mumbai" },
      { coords: [13.0827, 80.2707], color: "yellow", popup: "Low Infection - Chennai" },
    ];

    infectionZones.forEach((zone) =>
      L.circle(zone.coords, { color: zone.color, radius: 1000 }).addTo(map).bindPopup(zone.popup)
    );

    // Add Victims
    victims.forEach(({ lat, lng, name, location }) => {
      if (lat && lng) {
        L.marker([lat, lng], { icon: victimIcon })
          .addTo(map)
          .bindPopup(`<b>Victim:</b> ${name}<br/><b>Location:</b> ${location}`);
      }
    });

    // Add Volunteers
    volunteers.forEach(({ lat, lng, name, resources }) => {
      if (lat && lng) {
        L.marker([lat, lng], { icon: volunteerIcon })
          .addTo(map)
          .bindPopup(`<b>Volunteer:</b> ${name}<br/><b>Resources:</b> ${resources}`);
      }
    });

    return () => map.remove(); // clean up map on unmount
  }, [victims, volunteers]); // re-run whenever context updates

  return <div id="map" style={{ height: "90vh", width: "100%" }}></div>;
}
