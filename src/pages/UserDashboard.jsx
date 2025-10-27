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
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchDashboard();
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  // Update status directly from dashboard
  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/reports/${reportId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      const updatedReport = await res.json();

      setRequests((prev) =>
        prev.map((r) =>
          r.reportId === reportId ? { ...r, status: updatedReport.status } : r
        )
      );
    } catch (err) {
      console.error(err.message);
      alert("Failed to update status");
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${BACKEND_URL}/api/user/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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
      {/* Profile */}
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
              <button onClick={() => alert("Profile editing coming soon!")}>Edit Profile</button>
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
            data={{
              labels: ["Pending", "Resolved", "Ongoing"],
              datasets: [
                {
                  data: [stats.pending, stats.resolved, 3],
                  backgroundColor: ["#fbc9cf", "#b7dfb6", "#fceabb"],
                  borderWidth: 2,
                  borderColor: "#fff",
                },
              ],
            }}
            options={{ cutout: "65%", radius: "70%", maintainAspectRatio: false }}
            height={250}
            width={250}
          />
        </div>
        <div className="chart-card">
          <h4>User Activity Over Time</h4>
          <Bar
            data={{
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
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              animation: { duration: 1500, easing: "easeInOutQuart" },
              scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, ticks: { stepSize: 10 } },
              },
            }}
          />
        </div>
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
                  <td className="status-cell">
                    <span className={`status-chip ${getStatusClass(req.status)}`}>
                      {req.status || "Pending"}
                    </span>
                    {/* Hover dropdown */}
                    {req.reportId && (
                      <select
                        className="status-dropdown"
                        value={req.status}
                        onChange={(e) =>
                          handleStatusUpdate(req.reportId, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    )}
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
