import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in as: ${email}`);
  };

  return (
    <main className="page">
      <h1>Login</h1>
      <p className="tagline">Access your account to coordinate, connect, and help faster.</p>

      <form className="form-box" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Login</button>

        <p>New here? <a href="/register">Create account</a></p>
      </form>
    </main>
  );
}
