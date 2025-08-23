import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapPage() {
  useEffect(() => {
    const map = L.map("map", { zoomControl: false }).setView([20, 80], 4);
    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Infection Zones
    L.circle([28.7041, 77.1025], { color: "red", radius: 1000 }).addTo(map).bindPopup("High Infection - Delhi");
    L.circle([19.0760, 72.8777], { color: "orange", radius: 1000 }).addTo(map).bindPopup("Medium Infection - Mumbai");
    L.circle([13.0827, 80.2707], { color: "yellow", radius: 1000 }).addTo(map).bindPopup("Low Infection - Chennai");

    return () => map.remove();
  }, []);

  return <div id="map" style={{ height: "90vh", width: "100%" }}></div>;
}
