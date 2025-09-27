import { useState } from "react";
import { useAppContext } from "../Context/AppContext";

export default function Request() {
  const { addVictim } = useAppContext();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [helpType, setHelpType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location || !contact || !helpType) return;

    await addVictim({ name, location, contact, helpType });
    setName(""); setLocation(""); setContact(""); setHelpType("");
    alert("Request submitted successfully!");
  };

  return (
    <main className="page">
      <h1>Request Help</h1>
      <form className="form-box" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
        
        <label>Location:</label>
        <input value={location} onChange={e => setLocation(e.target.value)} required />
        
        <label>Contact:</label>
        <input value={contact} onChange={e => setContact(e.target.value)} required />
        
        <label>Help Type:</label>
        <input value={helpType} onChange={e => setHelpType(e.target.value)} required />
        
        <button type="submit">Submit Request</button>
      </form>
    </main>
  );
}
