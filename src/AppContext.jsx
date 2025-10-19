import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [victims, setVictims] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  // Load user from backend using token on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setLoggedInUser(data.user); // ✅ ensure backend returns { user: {...} }
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      } catch (err) {
        console.error("Error fetching logged-in user:", err);
        setLoggedInUser(null);
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("token");
      }
    };

    fetchUser();
  }, []);

  // Logout function
  const logout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
  };

  return (
    <AppContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
        logout,
        victims,
        setVictims,
        volunteers,
        setVolunteers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
