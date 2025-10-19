import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext.jsx";
import Swal from "sweetalert2";

const RecommendedContent = () => {
  const { loggedInUser } = useAppContext();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!loggedInUser?._id && !loggedInUser?.id) return;

    const fetchRecommendations = async () => {
      try {
        const userId = loggedInUser._id || loggedInUser.id;

        const res = await fetch(`http://localhost:5000/api/user/${userId}/recommendations`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Failed to fetch recommendations");
        }

        const data = await res.json();
        console.log("Recommendations fetched:", data.recommendations);
        setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : []);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch recommendations", "error");
      }
    };

    fetchRecommendations();
  }, [loggedInUser]);

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Recommended for You</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {recommendations.map((item, i) => (
          <li
            key={i}
            style={{
              padding: "8px",
              background: "#f0f0f0",
              marginBottom: "5px",
              borderRadius: "5px",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedContent;
