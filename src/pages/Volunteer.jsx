// src/pages/Volunteer.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../AppContext.jsx";
import Swal from "sweetalert2";
import RecommendedContent from "../components/RecommendedContent.jsx";

export default function Volunteer() {
  const { volunteers, setVolunteers, loggedInUser } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resources, setResources] = useState([]);
  const [skills, setSkills] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [submitting, setSubmitting] = useState(false);

  // Auto-detect location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
    Swal.fire({
      title: "🎧 & 🎤 Buttons Info",
      html: `
        <p><b>🎧 Hear:</b> Click to listen to the question in the selected language.</p>
        <p><b>🎤 Speak:</b> Click to answer by speaking; your speech will be converted to text.</p>
      `,
      icon: "info",
      confirmButtonText: "Got it!",
      showCloseButton: true,
    });
  }, []);

  // ---------------- Speech Functions ----------------
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language;
    window.speechSynthesis.speak(utter);
  };

  const listen = (setter) => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      Swal.fire("Voice input not supported in this browser");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
      let text = e.results[0][0].transcript;
      // Sanitize phone input
      if (setter === setPhone) text = text.replace(/\D/g, "");
      setter(text);
    };
    recognition.start();
  };

  // ---------------- Submit Form ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    if (!loggedInUser) {
      Swal.fire({ icon: "error", title: "❌ Please login first!" });
      speak("Please log in first.");
      setSubmitting(false);
      return;
    }

    if (!name || !email || !phone) {
      Swal.fire({ icon: "error", title: "Please fill all required fields" });
      speak("Please fill all required fields.");
      setSubmitting(false);
      return;
    }

    const sanitizedPhone = phone.replace(/\D/g, "");
    if (sanitizedPhone.length < 10) {
      Swal.fire({ icon: "error", title: "Invalid phone number" });
      speak("Please enter a valid phone number.");
      setSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    const newVolunteer = {
      name,
      email,
      phone: sanitizedPhone,
      resources,
      skills,
      lat: location.lat,
      lng: location.lng,
      userId: loggedInUser.id,
    };

    try {
      if (token) {
        const res = await fetch("http://localhost:5000/api/volunteers", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(newVolunteer),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Network error");
      }

      setVolunteers([...volunteers, newVolunteer]);
      Swal.fire({ icon: "success", title: "✅ Volunteer registered!", timer: 1500, showConfirmButton: false });
      speak("Thank you for registering as a volunteer.");
      setName(""); setEmail(""); setPhone(""); setResources([]); setSkills("");
    } catch (err) {
      Swal.fire({ icon: "error", title: "❌ Registration failed", text: err.message });
      speak("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- Voice Input Component ----------------
  const voiceInput = (label, value, setter, placeholder) => (
    <div className="voice-input-wrapper">
      <label>{label}:</label>
      <input
        value={value}
        onChange={(e) => {
          if (setter === setPhone) setter(e.target.value.replace(/\D/g, ""));
          else setter(e.target.value);
        }}
        placeholder={placeholder}
        required
      />
      <div className="voice-buttons">
        <button type="button" onClick={() => speak(label)}>🎧</button>
        <button type="button" onClick={() => listen(setter)}>🎤</button>
      </div>
    </div>
  );

  return (
    <main className="page">
      <h1>Volunteer Registration</h1>

      <label>Language:</label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en-US">English</option>
        <option value="hi-IN">Hindi</option>
        <option value="es-ES">Spanish</option>
        <option value="fr-FR">French</option>
      </select>

      <form onSubmit={handleSubmit} className="form-box">
        {voiceInput("Full Name", name, setName, "Enter your name")}
        {voiceInput("Email", email, setEmail, "Enter your email")}
        {voiceInput("Phone Number", phone, setPhone, "Enter your phone")}

        <label>Available Resources:</label>
        <div className="resources">
          {["Clothing","Food","Water","Medicine","Shelter","Other"].map((r) => (
            <label key={r}>
              <input
                type="checkbox"
                value={r}
                checked={resources.includes(r)}
                onChange={(e) =>
                  setResources(
                    e.target.checked
                      ? [...resources, r]
                      : resources.filter(x => x !== r)
                  )
                }
              /> {r}
            </label>
          ))}
        </div>

        {voiceInput("Other Skills", skills, setSkills, "E.g., medical aid, transport")}

        <label>Detected Location:</label>
        <input value={`${location.lat}, ${location.lng}`} readOnly />

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Join as Volunteer"}
        </button>
      </form>

      <RecommendedContent />

      <style>{`
        .voice-input-wrapper { position: relative; margin-bottom: 1rem; }
        input, textarea { width: 100%; padding: 0.5rem 3rem 0.5rem 0.5rem; border-radius: 6px; border: 1px solid #ccc; box-sizing: border-box; }
        .voice-buttons { position: absolute; top: 50%; transform: translateY(-50%); right: 5px; display: flex; gap: 5px; }
        .voice-buttons button { border: none; background: none; cursor: pointer; font-size: 1.2rem; }
        .resources label { display: inline-block; margin-right: 10px; }
      `}</style>
    </main>
  );
}
