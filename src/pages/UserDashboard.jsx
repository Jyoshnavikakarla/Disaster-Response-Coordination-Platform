import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext.jsx"; // ✅ FIX: correct relative path
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDashboard = () => {
  const { loggedInUser } = useAppContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]); 


  useEffect(() => {
    if (!loggedInUser) return;

    const endpoint =
      loggedInUser.role === "victim"
        ? `http://localhost:5000/api/user/${loggedInUser.id}/requests`
        : `http://localhost:5000/api/user/${loggedInUser.id}/activities`;

    const fetchData = async () => {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();

        // ✅ FIX: ensure it's always an array
        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Server error. Please try again later.", "error");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser?.role === "victim" && Array.isArray(data) && data.length > 0) {
      const map = L.map("map").setView(
        [data[0].latitude || 31.1471, data[0].longitude || 75.3412],
        7
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      data.forEach((item) => {
        if (item.latitude && item.longitude) {
          L.marker([item.latitude, item.longitude])
            .addTo(map)
            .bindPopup(`<b>${item.request}</b><br/>Status: ${item.status}`);
        }
      });

      return () => map.remove();
    }
  }, [loggedInUser, data]);

  if (loading) return <p>Loading dashboard...</p>;

  // ✅ Safe chart data setup
  const chartData = {
    labels: Array.isArray(data) ? data.map((item) => item.date || "N/A") : [],
    datasets: [
      {
        label: "Tasks Completed",
        data: Array.isArray(data)
          ? data.map((item) => (item.completed ? 1 : 0))
          : [],
        backgroundColor: "#42A5F5",
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {loggedInUser?.name}</h2>
      <h4>Role: {loggedInUser?.role}</h4>

      {/* Victim Map */}
      {loggedInUser?.role === "victim" ? (
        <>
          <h3>Your Request Locations</h3>
          <div
            id="map"
            style={{
              height: "400px",
              width: "100%",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          ></div>
        </>
      ) : (
        <>
          <h3>Volunteer Task Overview</h3>
          <div style={{ width: "80%", margin: "auto" }}>
            <Bar data={chartData} />
          </div>
        </>
      )}

      {/* Data Table */}
      <div style={{ marginTop: "30px" }}>
        <h3>
          {loggedInUser?.role === "victim" ? "Your Requests" : "Your Activities"}
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
            border: "1px solid #ddd",
          }}
        >
          <thead>
            <tr style={{ background: "#eee" }}>
              {(loggedInUser?.role === "victim"
                ? ["Request", "Location", "Status"]
                : ["Task", "Location", "Date", "Status"]
              ).map((header, i) => (
                <th
                  key={i}
                  style={{ padding: "8px", border: "1px solid #ddd" }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {item.request || item.task}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {item.location}
                  </td>
                  {loggedInUser?.role !== "victim" && (
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {item.date || "N/A"}
                    </td>
                  )}
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                  No records found
                </td>
              </tr>
            )}
            
          </tbody>
        </table>
        {/* Recommendations */}
{recommendations.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h3>Recommended For You</h3>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {recommendations.map((item, i) => (
        <li key={i} style={{ padding: "8px", background: "#f0f0f0", marginBottom: "5px", borderRadius: "5px" }}>
          {item}
        </li>
      ))}
    </ul>
  </div>
)}

      </div>
    </div>
  );
};

export default UserDashboard;
