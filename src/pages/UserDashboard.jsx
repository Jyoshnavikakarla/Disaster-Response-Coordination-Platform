// src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext.jsx";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// 3️⃣ Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

export default function UserDashboard() {
  const { loggedInUser } = useAppContext();
  const [data, setData] = useState([]);

  // Fetch user-specific data
  useEffect(() => {
    if (!loggedInUser) return;
    const endpoint = loggedInUser.role === "victim"
      ? `/api/user/${loggedInUser.id}/requests`
      : `/api/user/${loggedInUser.id}/activities`;

    fetch(endpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(res => setData(res.requests || res.activities))
      .catch(err => console.error(err));
  }, [loggedInUser]);

  // Initialize map for victim requests
  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== "victim" || !data.length) return;

    const map = L.map("dashboard-map").setView([20, 80], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    data.forEach(d => {
      if (d.lat && d.lng) {
        L.marker([d.lat, d.lng])
          .addTo(map)
          .bindPopup(`<b>${d.name}</b><br/>${d.location}<br/>${d.details}`);
      }
    });

    return () => map.remove();
  }, [data, loggedInUser]);

  if (!loggedInUser) return <p>Please login to view your dashboard.</p>;

  // Prepare chart data for volunteers
  const chartData = {
    labels: data.map(a => new Date(a.date).toLocaleDateString()),
    datasets: [
      {
        label: "Tasks Completed",
        data: data.map(a => a.status === "completed" ? 1 : 0),
        backgroundColor: "#4caf50",
      },
    ],
  };

  return (
    <main className="page dashboard-page">
      <h1>Hello, {loggedInUser.name}!</h1>

      {/* Summary Cards */}
      <div className="cards-container" style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div className="card" style={{ padding: "20px", background: "#f5f5f5", borderRadius: "8px" }}>
          Total {loggedInUser.role === "victim" ? "Requests" : "Activities"}: {data.length}
        </div>
      </div>

      {/* Table */}
      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            {loggedInUser.role === "victim"
              ? ["Request", "Location", "Status"]
              : ["Task", "Location", "Date", "Status"]}
          </tr>
        </thead>
        <tbody>
          {data.length ? data.map((d, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #ccc" }}>
              {loggedInUser.role === "victim"
                ? [<td key={0}>{d.details}</td>, <td key={1}>{d.location}</td>, <td key={2}>{d.status}</td>]
                : [<td key={0}>{d.task}</td>, <td key={1}>{d.location}</td>, <td key={2}>{new Date(d.date).toLocaleDateString()}</td>, <td key={3}>{d.status}</td>]}
            </tr>
          )) : (
            <tr><td colSpan={loggedInUser.role === "victim" ? 3 : 4} style={{ textAlign: "center" }}>No data available.</td></tr>
          )}
        </tbody>
      </table>

      {/* Chart for volunteer activity */}
      {loggedInUser.role === "volunteer" && data.length > 0 && (
        <div style={{ width: "60%", margin: "40px auto" }}>
          <Bar data={chartData} />
        </div>
      )}

      {/* Mini Map for victims */}
      {loggedInUser.role === "victim" && data.length > 0 && (
        <div id="dashboard-map" style={{ height: "400px", marginTop: "40px", borderRadius: "8px", border: "1px solid #ccc" }}></div>
      )}
    </main>
  );
}
