import React, { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "./user-dashboard.css";
import { useNavigate, useLocation } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const BACKEND_URL = "http://localhost:5000";

const UserDashboard = () => {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    resolved: 0,
    messages: 0,
  });
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  // Fetch weather info
  const handleFetchWeather = async () => {
    if (!city.trim()) return alert("Please enter a city name!");
    try {
      const apiKey = "f82f0d132424dc14d79f41301a41f1cd";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather({
          name: data.name,
          temp: data.main.temp,
          desc: data.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        });
      } else {
        alert("City not found!");
      }
    } catch (err) {
      console.error("Weather fetch failed:", err);
      alert("Failed to fetch weather. Try again later.");
    }
  };

  // Fetch dashboard data
  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      const dashRes = await fetch(`${BACKEND_URL}/api/dashboard/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!dashRes.ok) throw new Error("Failed to fetch dashboard data");
      const dashData = await dashRes.json();

      setUser(dashData.user || {});
      setStats({
        totalActions:
          (dashData.resolved || 0) +
          (dashData.pending || 0) +
          (dashData.ongoing || 0),
        pending: dashData.pending || 0,
        resolved: dashData.resolved || 0,
        messages: dashData.messages || 0,
      });
      setRequests(dashData.recentRequests || []);
      console.log("🔄 Dashboard refreshing...");
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

  // ✅ Auto refresh after report update
  useEffect(() => {
    if (location.state?.refresh) {
      fetchDashboard();
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  // Profile edit
  const handleProfileEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("⚠️ Please log in again");
      const updated = {
        name: prompt("Enter new name:", user.name),
        email: prompt("Enter new email:", user.email),
        location: prompt("Enter new location:", user.location),
        avatar: prompt("Enter new avatar URL:", user.avatar),
      };
      const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        alert("✅ Profile updated successfully!");
      } else {
        alert("❌ " + (data.message || "Error updating profile"));
      }
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${BACKEND_URL}/api/user/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Charts
  const doughnutData = {
    labels: ["Pending", "Resolved", "Ongoing"],
    datasets: [
      {
        data: [stats.pending, stats.resolved, 3],
        backgroundColor: ["#fbc9cf", "#b7dfb6", "#fceabb"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "User Activity",
        data: [15, 25, 18, 30, 22, 35, 28],
        backgroundColor: "rgba(113, 180, 255, 0.6)",
        borderColor: "rgba(41, 128, 185, 0.9)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    animation: { duration: 1500, easing: "easeInOutQuart" },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 10 } },
    },
  };

  // ✅ helper for colored status chips
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "resolved":
        return "status-green";
      case "in progress":
      case "ongoing":
        return "status-yellow";
      default:
        return "status-red";
    }
  };

  return (
    <div className="user-dashboard-container">
      {/* Profile Section */}
      <div className="user-profile-section">
        <div className="profile-info">
          <img
            src={user.avatar || "https://placehold.co/80x80"}
            alt="profile"
            className="profile-pic"
          />
          <div>
            <h2>{user.name || "Loading..."}</h2>
            <p>{user.email || "Loading..."}</p>
            <p>{user.role || "User"}</p>
            <p>{user.location || "Loading..."}</p>
            <div className="profile-btns">
              <button onClick={handleProfileEdit}>Edit Profile</button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="stats-section">
        <div className="stat-card blue hoverable">
          <h4>Total Requests</h4>
          <p>{stats.totalActions || 0}</p>
        </div>
        <div className="stat-card yellow hoverable">
          <h4>Pending Requests</h4>
          <p>{stats.pending || 0}</p>
        </div>
        <div className="stat-card green hoverable">
          <h4>Resolved Requests</h4>
          <p>{stats.resolved || 0}</p>
        </div>
        <div className="stat-card gray hoverable">
          <h4>Messages</h4>
          <p>{stats.messages || 0}</p>
        </div>
      </section>

      {/* Charts */}
      <section className="charts-section">
        <div className="chart-card">
          <h4>Request Status</h4>
          <Doughnut
            data={doughnutData}
            options={{ cutout: "65%", radius: "70%", maintainAspectRatio: false }}
            height={250}
            width={250}
          />
        </div>
        <div className="chart-card">
          <h4>User Activity Over Time</h4>
          <Bar data={barData} options={barOptions} />
        </div>
      </section>

      {/* Weather */}
      <section className="insights-section">
        <h4>Smart Insights</h4>
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginRight: "8px",
              width: "180px",
            }}
          />
          <button
            onClick={handleFetchWeather}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#4b7bec",
              color: "white",
              cursor: "pointer",
            }}
          >
            Get Weather
          </button>
        </div>
        {weather ? (
          <p>
            🌤️ <strong>{weather.name}</strong>: {weather.temp}°C, {weather.desc}{" "}
            <img
              src={weather.icon}
              alt={weather.desc}
              style={{
                width: "35px",
                verticalAlign: "middle",
                marginLeft: "8px",
              }}
            />
          </p>
        ) : (
          <p>Enter a city to get real-time weather insights 🌍</p>
        )}
      </section>

      {/* Request History */}
      <section className="history-section">
        <h4>Request History</h4>
        <table>
          <thead>
            <tr>
              <th>Disaster Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Response / View</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.type || "Flood"}</td>
                  <td>{req.date || "2025-09-10"}</td>
                  <td>
                    <span className={`status-chip ${getStatusClass(req.status)}`}>
                      {req.status || "Resolved"}
                    </span>
                  </td>
                  <td>
                    {req.reportId ? (
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/reports/${req.reportId}`)}
                      >
                        View
                      </button>
                    ) : (
                      <button
                        className="view-btn"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");
                            if (!token) return alert("Please login again");
                            const reportPayload = {
                              requestId: req._id,
                              title: req.type,
                              description: req.details || req.type,
                              location: req.location || "N/A",
                            };
                            const res = await fetch(`${BACKEND_URL}/api/reports`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify(reportPayload),
                            });
                            if (!res.ok) throw new Error("Failed to create report");
                            const newReport = await res.json();
                            navigate(`/reports/${newReport.report._id}`);
                          } catch (err) {
                            console.error(err);
                            alert("Failed to open report");
                          }
                        }}
                      >
                        Create & View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UserDashboard;
