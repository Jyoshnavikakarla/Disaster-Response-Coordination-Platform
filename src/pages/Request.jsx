// src/pages/Request.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../AppContext.jsx";
import Swal from "sweetalert2";
import RecommendedContent from "../components/RecommendedContent.jsx";

export default function Request() {
  const { victims, setVictims, loggedInUser } = useAppContext();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [location, setLocation] = useState({ lat: "", lng: "" });

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
      const text = e.results[0][0].transcript;
      // Sanitize contact input to remove non-digit characters if the field is contact
      if (setter === setContact) {
        setter(text.replace(/\D/g, ""));
      } else {
        setter(text);
      }
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

    // Validate fields
    if (!name || !contact || !details) {
      Swal.fire({ icon: "error", title: "Please fill all fields" });
      speak("Please fill all fields.");
      setSubmitting(false);
      return;
    }

    // Ensure contact is digits only and valid length
    const sanitizedContact = contact.replace(/\D/g, "");
    if (sanitizedContact.length < 10) {
      Swal.fire({ icon: "error", title: "Invalid contact number" });
      speak("Please enter a valid contact number.");
      setSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    const newRequest = {
      name,
      contact: sanitizedContact,
      details,
      location: `${location.lat},${location.lng}`,
      lat: location.lat,
      lng: location.lng,
      role: loggedInUser.role,
      userId: loggedInUser.id,
    };

    try {
      const res = await fetch("http://localhost:5000/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newRequest),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Network error");

      setVictims([...victims, { ...newRequest, id: data._id }]);
      Swal.fire({ icon: "success", title: "✅ Request submitted!", timer: 1500, showConfirmButton: false });
      speak("Your request has been submitted successfully.");

      setName(""); setContact(""); setDetails("");
    } catch (err) {
      Swal.fire({ icon: "error", title: "❌ Submission failed", text: err.message });
      speak("Submission failed. Please try again.");
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
          // Sanitize contact input
          if (setter === setContact) {
            setter(e.target.value.replace(/\D/g, ""));
          } else {
            setter(e.target.value);
          }
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
      <h1>Help Request Form</h1>

      <label>Language:</label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en-US">English</option>
        <option value="hi-IN">Hindi</option>
        <option value="es-ES">Spanish</option>
        <option value="fr-FR">French</option>
      </select>

      <form onSubmit={handleSubmit} className="form-box">
        {voiceInput("Full Name", name, setName, "Enter your name")}
        {voiceInput("Contact Number", contact, setContact, "Enter your contact number")}
        {voiceInput("Details of Emergency", details, setDetails, "Describe the emergency")}

        <label>Detected Location:</label>
        <input value={`${location.lat}, ${location.lng}`} readOnly />

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      <RecommendedContent />

      <style>{`
        .voice-input-wrapper { position: relative; margin-bottom: 1rem; }
        input, textarea { width: 100%; padding: 0.5rem 3rem 0.5rem 0.5rem; border-radius: 6px; border: 1px solid #ccc; box-sizing: border-box; }
        .voice-buttons { position: absolute; top: 50%; transform: translateY(-50%); right: 5px; display: flex; gap: 5px; }
        .voice-buttons button { border: none; background: none; cursor: pointer; font-size: 1.2rem; }
      `}</style>
    </main>
  );
}
