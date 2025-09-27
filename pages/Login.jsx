import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { users, setLoggedInUser } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      setLoggedInUser(foundUser);
      Swal.fire({
        title: "Login Successful!",
        icon: "success",
        showConfirmButton: false,
        timer: 2000
      }).then(() => navigate("/"));
    } else {
      Swal.fire({
        title: "Invalid email or password",
        icon: "error",
        confirmButtonText: "Try Again"
      });
    }
  };

  return (
    <main className="page">
      <h1>Login</h1>
      <p className="tagline"> Access your account to coordinate, connect, and help faster. </p>
      <form className="form-box" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <p> New here? <a href="/register">Create account</a> </p>
      </form>
    </main>
  );
}
