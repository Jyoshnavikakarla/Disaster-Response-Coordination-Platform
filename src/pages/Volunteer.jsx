export default function Volunteer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Thank you for registering as a volunteer!");
    e.target.reset();
  };

  return (
    <main className="page">
      <h1>Volunteer Registration</h1>
      <p className="tagline">
        Sign up to join our network of volunteers and provide essential
        resources.
      </p>

      <form className="form-box" onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input type="text" placeholder="Enter your name" required />

        <label>Email:</label>
        <input type="email" placeholder="Enter your email" required />

        <label>Phone Number:</label>
        <input type="tel" placeholder="Enter your phone number" required />

        <label>Available Resources:</label>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" name="resources" value="Clothing" /> Clothing
          </label>
          <label>
            <input type="checkbox" name="resources" value="Food" /> Food
          </label>
          <label>
            <input type="checkbox" name="resources" value="Water" /> Water
          </label>
          <label>
            <input type="checkbox" name="resources" value="Medicine" /> Medicine
          </label>
          <label>
            <input type="checkbox" name="resources" value="Safe Shelter" /> Safe
            Shelter
          </label>
          <label>
            <input type="checkbox" name="resources" value="Space" /> Space
          </label>
          <label>
            <input type="checkbox" name="resources" value="Other" /> Other
          </label>
        </div>

        <label>Other Skills:</label>
        <textarea placeholder="E.g., transport, medical aid, communication"></textarea>

        <button type="submit">Join as Volunteer</button>
      </form>
    </main>
  );
}
