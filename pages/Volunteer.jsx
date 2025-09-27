import { useState } from "react";
import { useAppContext } from "../Context/AppContext";

export default function Volunteer() {
  const { volunteers, addVolunteer, deleteVolunteer } = useAppContext();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [skills, setSkills] = useState("");
  const [resources, setResources] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !contact) return;

    await addVolunteer({ name, contact, skills, resources });
    setName(""); setContact(""); setSkills(""); setResources("");
    alert("Volunteer added successfully!");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this volunteer?")) {
      await deleteVolunteer(id);
    }
  };

  return (
    <main className="page">
      <h1>Volunteer Registration</h1>

      <form className="form-box" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />

        <label>Contact:</label>
        <input value={contact} onChange={e => setContact(e.target.value)} required />

        <label>Skills:</label>
        <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g., Transport, Medical" />

        <label>Resources:</label>
        <input value={resources} onChange={e => setResources(e.target.value)} placeholder="e.g., Food, Water" />

        <button type="submit">Add Volunteer</button>
      </form>

      <section>
        <h2>Registered Volunteers</h2>
        {volunteers.length === 0 ? <p>No volunteers yet.</p> :
          <ul>
            {volunteers.map(v => (
              <li key={v.id}>
                {v.name} | {v.contact} | {v.skills || "N/A"} | {v.resources || "N/A"}
                <button onClick={() => handleDelete(v.id)} style={{marginLeft: "10px"}}>Delete</button>
              </li>
            ))}
          </ul>
        }
      </section>
    </main>
  );
}
