import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useAppContext } from "../AppContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setLoggedInUser } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Step 3: Save user + token in context & localStorage
      setLoggedInUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));

      Swal.fire({
        title: `Welcome, ${data.user.name}!`,
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => navigate("/dashboard")); // redirect to dashboard
    } catch (err) {
      Swal.fire({
        title: "Login failed",
        icon: "error",
        text: err.message,
      });
    }
  };

  return (
    <main className="page">
      <h1>Login</h1>
      <form className="form-box" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: "15px", textAlign: "center", color: "#555" }}>
    🤔 Don’t have an account?{" "}
    <span
      onClick={() => navigate("/register")}
      style={{ color: "#42A5F5", fontWeight: "bold", cursor: "pointer" }}
    >
      Sign up, fam! 🚀
    </span>
  </p>
    </main>
  );
}
