import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAppContext } from "../AppContext.jsx";
import RecommendedContent from "../components/RecommendedContent.jsx";

// Custom icons
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
  const mapRef = useRef(null); // ✅ Persist map instance

  // ---------------- Track page visit for recommendations ----------------
  useEffect(() => {
    if (loggedInUser) {
      fetch("http://localhost:5000/api/user/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUser.id, page: "map" }),
      }).catch((err) => console.error("Failed to record history:", err));
    }
  }, [loggedInUser]);

  // ---------------- Initialize Leaflet Map ----------------
  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map only once
      mapRef.current = L.map("map", { zoomControl: false }).setView([20, 80], 5);
      L.control.zoom({ position: "topright" }).addTo(mapRef.current);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear previous layers before adding new markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // ---------------- Infection Zones ----------------
    const infectionZones = [
      { coords: [28.7041, 77.1025], color: "red", popup: "High Infection - Delhi" },
      { coords: [19.076, 72.8777], color: "orange", popup: "Medium Infection - Mumbai" },
      { coords: [13.0827, 80.2707], color: "yellow", popup: "Low Infection - Chennai" },
    ];

    infectionZones.forEach((zone) => {
      L.circle(zone.coords, { color: zone.color, radius: 1000 })
        .addTo(map)
        .bindPopup(zone.popup);
    });

    // ---------------- Victims ----------------
    victims?.forEach(({ lat, lng, name, location }) => {
      if (lat && lng) {
        L.marker([lat, lng], { icon: victimIcon })
          .addTo(map)
          .bindPopup(`<b>Victim:</b> ${name}<br/><b>Location:</b> ${location}`);
      }
    });

    // ---------------- Volunteers ----------------
    volunteers?.forEach(({ lat, lng, name, resources }) => {
      if (lat && lng) {
        L.marker([lat, lng], { icon: volunteerIcon })
          .addTo(map)
          .bindPopup(`<b>Volunteer:</b> ${name}<br/><b>Resources:</b> ${resources}`);
      }
    });

    // Optional cleanup: keep map instance but remove markers when component unmounts
    return () => {
      // Don't remove the map itself to prevent re-initialization issues
      // Layers (markers/circles) are removed automatically next render
    };
  }, [victims, volunteers]);

  return (
    <div style={{ position: "relative", height: "90vh", width: "100%" }}>
      <div id="map" style={{ height: "100%", width: "100%" }}></div>
      <RecommendedContent /> {/* overlays only if recommendations exist */}
    </div>
  );
}
