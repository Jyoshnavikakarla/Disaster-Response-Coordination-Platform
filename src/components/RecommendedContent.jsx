// src/components/RecommendedContent.jsx
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext.jsx";

export default function RecommendedContent() {
  const { loggedInUser } = useAppContext();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!loggedInUser) return;

    fetch(`http://localhost:5000/api/user/${loggedInUser.id}/recommendations`)
      .then(res => res.json())
      .then(data => setRecommendations(data.recommendations || []))
      .catch(err => console.error("Failed to fetch recommendations:", err));
  }, [loggedInUser]);

  // Only render if there are recommendations
  if (!loggedInUser || recommendations.length === 0) return null;

  return (
  <div style={{
    padding: "1rem",
    background: "#f7f7f7",
    borderTop: "1px solid #ccc"
  }}>
    <h4>Recommended for you:</h4>
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {recommendations.map(page => (
        <li key={page}>
          <a href={`/${page}`} style={{ textDecoration: "none", color: "#0066cc" }}>
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

}
