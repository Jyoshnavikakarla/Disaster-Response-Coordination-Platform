import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [victims, setVictims] = useState([]);      // ✅ Global victim state
  const [volunteers, setVolunteers] = useState([]); // ✅ Global volunteer state

  return (
    <AppContext.Provider value={{
      users,
      setUsers,
      loggedInUser,
      setLoggedInUser,
      victims,
      setVictims,
      volunteers,
      setVolunteers
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
