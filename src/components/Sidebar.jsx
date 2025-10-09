// src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedInUser, setLoggedInUser } = useAppContext();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoggedInUser(null);
        Swal.fire({
          icon: "success",
          title: "Logged out successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
        onClose();
      }
    });
  };

  // Function to handle guest click
  const handleGuestClick = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "warning",
      title: "❌ Please login first!",
    });
  };

  return (
    <div className="sidebar" style={{ width: isOpen ? "250px" : "0" }}>
      {/* Close button */}
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>

      {/* Common links visible to all */}
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
      <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
      <Link to="/selection" className={location.pathname === "/selection" ? "active" : ""}>Selection</Link>

      {/* Role-based or guest links */}
      {loggedInUser ? (
        <>
          <Link
            to="/map"
            className={location.pathname === "/map" ? "active" : ""}
          >
            Response Map
          </Link>
          <Link
            to="/request"
            className={location.pathname === "/request" ? "active" : ""}
          >
            Victim Request
          </Link>
          <Link
            to="/volunteer"
            className={location.pathname === "/volunteer" ? "active" : ""}
          >
            Volunteer
          </Link>
          <Link
            to="/alerts"
            className={location.pathname === "/alerts" ? "active" : ""}
          >
            Alerts & Communication
          </Link>

          {/* Authority-only link */}
          {loggedInUser.role === "authority" && (
            <Link
              to="/authority"
              className={location.pathname === "/authority" ? "active" : ""}
            >
              Authority Dashboard
            </Link>
          )}
        </>
      ) : (
        <>
          {/* Guests: show all links but warn on click */}
          <Link to="/map" onClick={handleGuestClick}>Response Map</Link>
          <Link to="/request" onClick={handleGuestClick}>Victim Request</Link>
          <Link to="/volunteer" onClick={handleGuestClick}>Volunteer</Link>
          <Link to="/alerts" onClick={handleGuestClick}>Alerts & Communication</Link>
          <Link to="/authority" onClick={handleGuestClick}>Authority Dashboard</Link>

          {/* Guests can access Login/Register */}
          <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
          <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>Register</Link>
        </>
      )}

      {/* Logged-in user info and logout */}
      {loggedInUser && (
        <div style={{ padding: "12px", color: "white" }}>
          <p>👋 Hello, {loggedInUser.name}</p>
          <button
            onClick={handleLogout}
            style={{
              background: "#0066cc",
              color: "white",
              border: "none",
              padding: "8px 12px",
              marginTop: "10px",
              borderRadius: "6px",
              cursor: "pointer",
              width: "100%"
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
