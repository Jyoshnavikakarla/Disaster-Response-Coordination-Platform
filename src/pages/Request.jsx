export default function Request() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Request submitted successfully!");
    e.target.reset();
  };

  return (
    <main className="page">
      <h1>Help Request Form</h1>
      <p className="tagline">Submit your request for assistance. Authorities and volunteers will be notified.</p>

      <form className="form-box" onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input type="text" placeholder="Enter your name" required />

        <label>Location:</label>
        <input type="text" placeholder="Enter your location" required />

        <label>Contact Number:</label>
        <input type="tel" placeholder="Enter your phone number" required />

        <label>Details of Emergency:</label>
        <textarea placeholder="Describe the emergency..." required></textarea>

        <button type="submit">Submit Request</button>
      </form>
    </main>
  );
}
