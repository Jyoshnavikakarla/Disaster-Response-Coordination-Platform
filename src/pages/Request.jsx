import { useState, useEffect } from "react";
import { useAppContext } from "../AppContext.jsx";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import RecommendedContent from "../components/RecommendedContent.jsx";

export default function Request() {
  const { victims, setVictims, loggedInUser } = useAppContext();
  const [location, setLocation] = useState("");

  // Auto-detect live location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(`${pos.coords.latitude},${pos.coords.longitude}`),
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedInUser) {
      Swal.fire({ icon: "error", title: "❌ Please login first!" });
      return;
    }

    const token = localStorage.getItem("token");
    const [lat, lng] = location.split(",").map(Number);

    const newRequest = {
      name: e.target.name.value,
      location,
      lat,
      lng,
      contact: e.target.contact.value,
      details: e.target.details.value,
      role: loggedInUser.role,
      userId: loggedInUser.id,
    };

    try {
      const res = await fetch("http://localhost:5000/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRequest),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Network error");
      }

      const result = await res.json();
      setVictims([...victims, { ...newRequest, id: result._id }]);

      Swal.fire({
        icon: "success",
        title: "✅ Request submitted successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      e.target.reset();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "❌ Submission failed!",
        text: err.message,
      });
    }
  };

  return (
    <main className="page">
      <h1>Help Request Form</h1>
      <p>Submit your request for assistance. Authorities and volunteers will be notified.</p>

      <form className="form-box" onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input type="text" name="name" placeholder="Enter your name" required />

        <label>Detected Location:</label>
        <input type="text" name="location" value={location} readOnly placeholder="Detecting location..." />

        <label>Contact Number:</label>
        <input type="tel" name="contact" placeholder="Enter your phone number" required />

        <label>Details of Emergency:</label>
        <textarea name="details" placeholder="Describe the emergency..." required />

        <button type="submit">Submit Request</button>
      </form>

      <RecommendedContent />
    </main>
  );
}
