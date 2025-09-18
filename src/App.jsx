import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";


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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request" element={<Request />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/authority" element={<Authority />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/register" element={<Register />} />
       
      </Routes>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
