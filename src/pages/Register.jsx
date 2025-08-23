export default function Register() {
  return (
    <main className="page">
      <h1>Register</h1>
      <p className="tagline">Create a new account to join the platform.</p>

      <form className="form-box">
        <label htmlFor="name">Full Name:</label>
        <input id="name" type="text" placeholder="Enter your full name" required />

        <label htmlFor="email">Email:</label>
        <input id="email" type="email" placeholder="Enter your email" required />

        <label htmlFor="phone">Phone Number:</label>
        <input id="phone" type="tel" placeholder="Enter your phone number" required />

        <label htmlFor="password">Password:</label>
        <input id="password" type="password" placeholder="Enter a password" required />

        <label htmlFor="confirm-password">Confirm Password:</label>
        <input id="confirm-password" type="password" placeholder="Re-enter your password" required />

        <button type="submit">Register</button>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </main>
  );
}
