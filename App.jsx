import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { useAppContext } from "./AppContext.jsx";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import Request from "./pages/Request";
import Volunteer from "./pages/Volunteer";
import Authority from "./pages/Authority";
import Alerts from "./pages/Alerts";
import MapPage from "./pages/MapPage";
import Selection from "./pages/Selection";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loggedInUser } = useAppContext();

  return (
    <>
      <button className="open-btn" onClick={() => setSidebarOpen(true)}>
        &#9776;
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            loggedInUser ? <UserDashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/request"
          element={loggedInUser ? <Request /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/volunteer"
          element={loggedInUser ? <Volunteer /> : <Navigate to="/login" replace />}
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

        {/* Other */}
        <Route path="/map" element={<MapPage />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
