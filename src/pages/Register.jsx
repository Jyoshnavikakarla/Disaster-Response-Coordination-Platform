import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email.includes("@")) {
      Swal.fire({ icon: "error", title: "Invalid email" });
      return;
    }
    if (password.length < 6) {
      Swal.fire({ icon: "error", title: "Password too short" });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({ icon: "error", title: "Passwords do not match" });
      return;
    }

    try {
      // Send POST request to backend
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "user" })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      Swal.fire({
        icon: "success",
        title: `Account created successfully! Welcome, ${data.user.name}`,
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Registration failed", text: err.message });
    }
  };

  return (
    <main className="page">
      <h1>Register</h1>
      <form className="form-box" onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </main>
  );
}
