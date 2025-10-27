import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./user-dashboard.css";

const BACKEND_URL = "http://localhost:5000";

const ReportsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Pending");

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login again");

      const res = await fetch(`${BACKEND_URL}/api/reports/${report._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updatedReport = await res.json();
      setReport((prev) => ({ ...prev, status: updatedReport.status }));
      alert("✅ Status updated successfully!");
    } catch (err) {
      console.error(err.message);
      alert("❌ Failed to update status");
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

        if (!res.ok) throw new Error("Failed to fetch report");

        const data = await res.json();
        const fetchedReport = data.report || data;

        setReport(fetchedReport);
        setSelectedStatus(fetchedReport.status || "Pending");
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
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
          padding: "1.5rem 2rem",
          borderRadius: "16px",
          color: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "0.3rem" }}>📋 Report Details</h1>
          <p style={{ opacity: "0.9" }}>Detailed information and actions for this disaster report.</p>
        </div>
        <button
          onClick={() => alert("📄 PDF Export coming soon!")}
          style={{
            backgroundColor: "#27ae60",
            color: "#fff",
            padding: "10px 16px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          📄 Export Report
        </button>
      </div>

      {/* Report Card */}
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
            textAlign: "center",
          }}
        >
          {report.title || "Untitled Report"}
        </h2>

        <div className="report-details" style={{ lineHeight: "1.8", fontSize: "1.05rem" }}>
          <p><strong>Description:</strong> {report.description || "No description provided."}</p>
          <p><strong>Location:</strong> {report.location || "Not specified"}</p>
          <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString() || "N/A"}</p>

          <p><strong>Status:</strong></p>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            {["Pending", "In Progress", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  background:
                    status === selectedStatus
                      ? status === "Completed"
                        ? "#6ee7b7"
                        : status === "In Progress"
                        ? "#fcd34d"
                        : "#fca5a5"
                      : "#e5e7eb",
                  color: status === selectedStatus ? "#000" : "#555",
                  transition: "all 0.2s",
                  boxShadow:
                    status === selectedStatus
                      ? "0 4px 8px rgba(0,0,0,0.2)"
                      : "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "2px",
            background: "linear-gradient(90deg, rgba(52,152,219,1) 0%, rgba(46,204,113,1) 100%)",
            margin: "1.8rem 0",
          }}
        ></div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            onClick={() => handleStatusChange(selectedStatus)}
            style={{
              backgroundColor: "#3498db",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            ✅ Submit
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              backgroundColor: "#555",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;