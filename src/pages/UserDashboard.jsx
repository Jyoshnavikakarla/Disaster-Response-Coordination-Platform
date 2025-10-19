import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext.jsx";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Swal from "sweetalert2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDashboard = () => {
  const { loggedInUser } = useAppContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedInUser?._id && !loggedInUser?.id) return;
    const userId = loggedInUser._id || loggedInUser.id;

    const fetchData = async () => {
      try {
        const endpoint =
          loggedInUser.role === "victim"
            ? `http://localhost:5000/api/user/${userId}/requests`
            : `http://localhost:5000/api/user/${userId}/activities`;

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) throw new Error("Failed to fetch data");

        const result = await res.json();
        setData(Array.isArray(result) ? result : result.data || []);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Server error. Please try again later.", "error");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loggedInUser]);

  // Map for Victims
  useEffect(() => {
    if (loggedInUser?.role !== "victim" || !data.length) return;

    const map = L.map("map").setView([data[0]?.lat || 31.1471, data[0]?.lng || 75.3412], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 }).addTo(map);

    data.forEach((item) => {
      if (item.lat && item.lng) {
        L.marker([item.lat, item.lng])
          .addTo(map)
          .bindPopup(`<b>${item.request || "Request"}</b><br/>Status: ${item.status || "N/A"}`);
      }
    });

    return () => map.remove();
  }, [loggedInUser, data]);

  if (loading) return <p>Loading dashboard...</p>;

  const chartData = {
    labels: data.map((item) => item.date || "N/A"),
    datasets: [
      {
        label: "Tasks Completed",
        data: data.map((item) => (item.completed ? 1 : 0)),
        backgroundColor: "#42A5F5",
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {loggedInUser?.name}</h2>
      <h4>Role: {loggedInUser?.role}</h4>

      {loggedInUser.role === "victim" ? (
        <div>
          <h3>Your Request Locations</h3>
          <div id="map" style={{ height: "400px", width: "100%", borderRadius: "10px", marginBottom: "20px" }}></div>
        </div>
      ) : (
        <div>
          <h3>Volunteer Task Overview</h3>
          <div style={{ width: "80%", margin: "auto" }}>
            <Bar data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
