import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [victims, setVictims] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  // Load user from localStorage on app start
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("token");
    if (user && token) {
      setLoggedInUser(JSON.parse(user));
    }
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
