import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./user-dashboard.css"; // Reuses your dashboard styles

const BACKEND_URL = "http://localhost:5000";

const ReportsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/reports/${report._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updatedReport = await res.json();
      setReport(updatedReport);
      alert("✅ Status updated successfully!");
      navigate("/dashboard", { state: { refresh: true } });
    } catch (err) {
      console.error(err.message);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) {
        setError("Invalid report ID");
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BACKEND_URL}/api/reports/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          if (res.status === 404) throw new Error("Report not found");
          throw new Error("Failed to fetch report");
        }
        const data = await res.json();
        setReport(data.report || data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading)
    return (
      <div className="user-dashboard-container" style={{ textAlign: "center", marginTop: "100px" }}>
        <div className="loading-spinner"></div>
        <p>Loading report details...</p>
      </div>
    );

  if (error)
    return (
      <div className="user-dashboard-container" style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>⚠️ {error}</h2>
        <button className="view-btn" onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
          Go Back
        </button>
      </div>
    );

  return (
    <div className="user-dashboard-container" style={{ padding: "2rem 3rem" }}>
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
          padding: "1.5rem 2rem",
          borderRadius: "16px",
          color: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ marginBottom: "0.3rem" }}>📋 Report Details</h1>
        <p style={{ opacity: "0.9" }}>Detailed information and actions for this disaster report.</p>
      </div>

      {/* Report Details Card */}
      <div
        className="edit-profile-card"
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "linear-gradient(180deg, #fdfbfb 0%, #ebedee 100%)",
          borderRadius: "20px",
          padding: "2rem 2.5rem",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          animation: "fadeIn 0.6s ease-in-out",
        }}
      >
        <h2
          style={{
            color: "#2c3e50",
            borderBottom: "3px solid #3498db",
            paddingBottom: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {report.title || "Untitled Report"}
        </h2>

        <div className="report-details">
          <p>
            <strong>Description:</strong> {report.description || "No description provided."}
          </p>
          <p>
            <strong>Location:</strong> {report.location || "Not specified"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(report.createdAt).toLocaleString() || "N/A"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <select
              value={report.status || "Pending"}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor:
                  report.status === "Completed"
                    ? "#b7dfb6"
                    : report.status === "In Progress"
                    ? "#fceabb"
                    : "#fbc9cf",
                transition: "0.3s",
              }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </p>
        </div>

        {/* Decorative Divider */}
        <div
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, rgba(52,152,219,1) 0%, rgba(46,204,113,1) 100%)",
            margin: "1.5rem 0",
          }}
        ></div>

        {/* Quick Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "1.5rem",
          }}
        >
          <button
            className="save-btn"
            onClick={() => navigate("/dashboard")}
            style={{
              backgroundColor: "#4b7bec",
              color: "white",
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            ⬅ Back to Dashboard
          </button>

          <button
            onClick={() => alert("PDF Export coming soon!")}
            style={{
              backgroundColor: "#27ae60",
              color: "white",
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            📄 Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
