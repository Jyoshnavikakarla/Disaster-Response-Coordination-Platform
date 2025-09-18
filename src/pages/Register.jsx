import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import Swal from "sweetalert2"; // ✅ SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { users, setUsers } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!email.includes("@")) {
      Swal.fire({
        icon: "error",
        title: "Invalid email address",
        confirmButtonText: "Try Again"
      });
      return;
    }
    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Password too short",
        text: "Password must be at least 6 characters",
        confirmButtonText: "Try Again"
      });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        confirmButtonText: "Try Again"
      });
      return;
    }

    // ✅ Check if user already exists (case-insensitive)
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      Swal.fire({
        icon: "warning",
        title: "User already exists",
        text: "Please login instead",
        confirmButtonText: "Go to Login"
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    // ✅ Save new user
    const newUser = { name, email, phone, password };
    setUsers([...users, newUser]);

    // ✅ Success popup
    Swal.fire({
      icon: "success",
      title: "Account created successfully!",
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      navigate("/login");
    });
  };

  return (
    <main className="page">
      <h1>Register</h1>
      <p className="tagline">Create a new account to join the platform.</p>

      <form className="form-box" onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name:</label>
        <input 
          id="name" 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name" 
          required 
        />

        <label htmlFor="email">Email:</label>
        <input 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email" 
          required 
        />

        <label htmlFor="phone">Phone Number:</label>
        <input 
          id="phone" 
          type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number" 
          required 
        />

        <label htmlFor="password">Password:</label>
        <input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a password" 
          required 
        />

        <label htmlFor="confirm-password">Confirm Password:</label>
        <input 
          id="confirm-password" 
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password" 
          required 
        />

        <button type="submit">Register</button>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </main>
  );
}
