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
import Alerts from "./pages/Alerts";
import MapPage from "./pages/MapPage";
import Selection from "./pages/Selection";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AuthorityDashboard from "./pages/AuthorityDashboard.jsx";
import RequestDetails from "./pages/RequestDetails";

import EditProfile from "./pages/EditProfile";


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
        <Route path="/requests/:id" element={<RequestDetails />} />


        {/* Dashboard with role-based access */}
        <Route
          path="/dashboard"
          element={
            loggedInUser ? (
              loggedInUser.role === "authority" ? (
                <AuthorityDashboard />
              ) : (
                <UserDashboard />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Other Routes */}
        <Route path="/map" element={<MapPage />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
