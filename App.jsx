import { useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { useAppContext } from "./AppContext.jsx";

// Lazy-loaded pages for performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Request = lazy(() => import("./pages/Request"));
const Volunteer = lazy(() => import("./pages/Volunteer"));
const Authority = lazy(() => import("./pages/Authority"));
const Alerts = lazy(() => import("./pages/Alerts"));
const MapPage = lazy(() => import("./pages/MapPage"));
const Selection = lazy(() => import("./pages/Selection"));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loggedInUser } = useAppContext();

  return (
    <>
      <button className="open-btn" onClick={() => setSidebarOpen(true)}>
        &#9776;
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Suspense fallback={<p>Loading page...</p>}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={loggedInUser ? <UserDashboard /> : <Navigate to="/login" replace />}
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
              loggedInUser?.role === "authority" ? <Authority /> : <Navigate to="/" />
            }
          />

          {/* Other */}
          <Route path="/map" element={<MapPage />} />
          <Route path="/selection" element={<Selection />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </Suspense>

      <Footer />
    </>
  );
}

export default App;
