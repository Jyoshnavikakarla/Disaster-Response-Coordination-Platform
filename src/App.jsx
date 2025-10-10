import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { useAppContext } from "./AppContext.jsx";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Request from "./pages/Request";
import Volunteer from "./pages/Volunteer";
import Authority from "./pages/Authority";
import Alerts from "./pages/Alerts";
import MapPage from "./pages/MapPage";
import Selection from "./pages/Selection";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard.jsx";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loggedInUser } = useAppContext();

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button className="open-btn" onClick={() => setSidebarOpen(true)}>
        &#9776;
      </button>

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/request"
          element={loggedInUser ? <Request /> : <Navigate to="/login" />}
        />
        <Route
          path="/volunteer"
          element={loggedInUser ? <Volunteer /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={loggedInUser ? <UserDashboard /> : <Navigate to="/login" />}
        />

        {/* Authority only */}
        <Route
          path="/authority"
          element={
            loggedInUser?.role === "authority" ? (
              <Authority />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Other routes accessible to everyone */}
        <Route path="/map" element={<MapPage />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
