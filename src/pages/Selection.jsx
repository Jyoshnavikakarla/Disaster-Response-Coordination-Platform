import { useNavigate } from "react-router-dom";

export default function Selection() {
  const navigate = useNavigate();
  return (
    <main className="page">
      <h1>How Can We Assist You?</h1>
      <p className="tagline">Select whether you need help or want to volunteer</p>

      <div className="choice-box">
        <button onClick={() => navigate("/request")}>🙋 Victim</button>
        <button onClick={() => navigate("/volunteer")}>🤝 Volunteer</button>
      </div>
    </main>
  );
}
