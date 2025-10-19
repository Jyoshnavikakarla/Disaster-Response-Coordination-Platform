import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAppContext } from "../AppContext.jsx";
import RecommendedContent from "../components/RecommendedContent.jsx";

const victimIcon = new L.Icon({
  iconUrl: "/victimIcon.jpg",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -35],
});

const volunteerIcon = new L.Icon({
  iconUrl: "/volunteerIcon.jpg",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -35],
});

export default function MapPage() {
  const { victims = [], volunteers = [], loggedInUser } = useAppContext();
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Track page visit
  useEffect(() => {
    if (loggedInUser) {
      fetch("http://localhost:5000/api/user/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ page: "map" }),
      }).catch((err) => console.error("Failed to record history:", err));
    }
  }, [loggedInUser]);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", { zoomControl: false }).setView([20, 80], 5);
      L.control.zoom({ position: "topright" }).addTo(mapRef.current);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Remove previous markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // Infection zones
    const infectionZones = [
      { coords: [28.7041, 77.1025], color: "red", popup: "High Infection - Delhi" },
      { coords: [19.076, 72.8777], color: "orange", popup: "Medium Infection - Mumbai" },
      { coords: [13.0827, 80.2707], color: "yellow", popup: "Low Infection - Chennai" },
    ];

    infectionZones.forEach((zone) => {
      const circle = L.circle(zone.coords, { color: zone.color, radius: 1000 }).addTo(map);
      markersRef.current.push(circle);
      circle.bindPopup(zone.popup);
    });

    // Victims
    victims?.forEach(({ lat, lng, name, location }) => {
      if (lat && lng) {
        const marker = L.marker([lat, lng], { icon: victimIcon }).addTo(map);
        marker.bindPopup(`<b>Victim:</b> ${name}<br/><b>Location:</b> ${location}`);
        markersRef.current.push(marker);
      }
    });

    // Volunteers
    volunteers?.forEach(({ lat, lng, name, resources }) => {
      if (lat && lng) {
        const marker = L.marker([lat, lng], { icon: volunteerIcon }).addTo(map);
        marker.bindPopup(`<b>Volunteer:</b> ${name}<br/><b>Resources:</b> ${resources}`);
        markersRef.current.push(marker);
      }
    });
  }, [victims, volunteers]);

  return (
    <div style={{ position: "relative", height: "90vh", width: "100%" }}>
      <div id="map" style={{ height: "100%", width: "100%" }}></div>
      <RecommendedContent />
    </div>
  );
}
