import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <div
      className="sidebar"
      style={{ width: isOpen ? "250px" : "0" }}
    >
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>

      <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
      <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
      <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
      <Link to="/selection" className={location.pathname === "/selection" ? "active" : ""}>Selection</Link>
      <Link to="/map" className={location.pathname === "/map" ? "active" : ""}>Response Map</Link>
      <Link to="/request" className={location.pathname === "/request" ? "active" : ""}>Request Form</Link>
      <Link to="/authority" className={location.pathname === "/authority" ? "active" : ""}>Authority Dashboard</Link>
      <Link to="/alerts" className={location.pathname === "/alerts" ? "active" : ""}>Alerts & Communication</Link>
    </div>
  );
}
