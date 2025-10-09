import { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Volunteer() {
  const { volunteers, setVolunteers } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resources, setResources] = useState([]);
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" }); // New state for location

  // Auto-detect live location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) setResources([...resources, value]);
    else setResources(resources.filter(r => r !== value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      Swal.fire({ icon: "error", title: "Please fill all required fields" });
      return;
    }

    const newVolunteer = {
      id: Date.now(),
      name,
      email,
      phone,
      resources,
      skills,
      lat: location.lat,
      lng: location.lng, // Save location
    };

    setVolunteers([...volunteers, newVolunteer]);

    Swal.fire({
      icon: "success",
      title: "✅ Thank you for registering as a volunteer!",
      showConfirmButton: false,
      timer: 1500,
    });

    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setResources([]);
    setSkills("");
  };

  return (
    <main className="page">
      <h1>Volunteer Registration</h1>
      <p className="tagline">
        Sign up to join our network of volunteers and provide essential resources.
      </p>

      <form className="form-box" onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Phone Number:</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          required
        />

        <label>Available Resources:</label>
        <div className="checkbox-group">
          {["Clothing", "Food", "Water", "Medicine", "Safe Shelter", "Space", "Other"].map((r) => (
            <label key={r}>
              <input
                type="checkbox"
                value={r}
                checked={resources.includes(r)}
                onChange={handleCheckboxChange}
              />{" "}
              {r}
            </label>
          ))}
        </div>

        <label>Other Skills:</label>
        <textarea
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="E.g., transport, medical aid, communication"
        />

        <label>Detected Location:</label>
        <input type="text" value={`${location.lat}, ${location.lng}`} readOnly />

        <button type="submit">Join as Volunteer</button>
      </form>
    </main>
  );
}
