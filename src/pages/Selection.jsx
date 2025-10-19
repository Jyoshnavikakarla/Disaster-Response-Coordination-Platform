import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext.jsx";
import RecommendedContent from "../components/RecommendedContent.jsx";
import { useEffect } from "react";

export default function Selection() {
  const navigate = useNavigate();
  const { loggedInUser } = useAppContext();

  // Track page visit for recommendations
  useEffect(() => {
  if (loggedInUser) {
    fetch("http://localhost:5000/api/user/history", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ page: "selection" }),
    }).catch((err) => console.error("Failed to record history:", err));
  }
}, [loggedInUser]);


  return (
    <main className="page">
      <h1>How Can We Assist You?</h1>
      <p className="tagline">Select whether you need help or want to volunteer</p>
      <div className="choice-box" role="group" aria-label="Choose your action">
        <button
          onClick={() => navigate("/request")}
          aria-label="Victim assistance page"
        >
          🙋 Victim
        </button>
        <button
          onClick={() => navigate("/volunteer")}
          aria-label="Volunteer signup page"
        >
          🤝 Volunteer
        </button>
      </div>



      <div className="recommendation-section">
        <RecommendedContent />
      </div>
    </main>
  );
}
