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

  return (
    <div
      className="sidebar"
      style={{ width: isOpen ? "250px" : "0" }}
    >
      {/* Close button */}
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>

      {/* Links */}
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
      {!loggedInUser && (
        <>
          <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
          <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>Register</Link>
        </>
      )}
      <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
      <Link to="/selection" className={location.pathname === "/selection" ? "active" : ""}>Selection</Link>
      <Link to="/map" className={location.pathname === "/map" ? "active" : ""}>Response Map</Link>
      <Link to="/request" className={location.pathname === "/request" ? "active" : ""}>Request Form</Link>
      <Link to="/authority" className={location.pathname === "/authority" ? "active" : ""}>Authority Dashboard</Link>
      <Link to="/alerts" className={location.pathname === "/alerts" ? "active" : ""}>Alerts & Communication</Link>

      {/* Logged-in user info (No logout for authority) */}
      {loggedInUser && (
        <div style={{ padding: "12px", color: "white" }}>
          <p>👋 Hello, {loggedInUser.name}</p>
          {loggedInUser.role !== "authority" && (
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
          )}
        </div>
      )}
    </div>
  );
}
