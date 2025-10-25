import { createContext, useContext, useState, useEffect } from "react";
import * as mockApi from "../API/mockAPI.js";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export function AppProvider({ children }) {
  // ---------------- Users ----------------
  const [users, setUsers] = useState([]); // store registered users
  const [loggedInUser, setLoggedInUser] = useState(null);

  const addUser = async (user) => {
    setUsers((prev) => [...prev, user]); // add new user to local state
  };

  // ---------------- Victims ----------------
  const [victims, setVictims] = useState([]);
  const fetchVictims = async () => {
    const data = await mockApi.getVictims();
    setVictims(data);
  };
  const addVictim = async (victim) => {
    await mockApi.createVictim(victim);
    fetchVictims();
  };
  const updateVictim = async (id, updates) => {
    await mockApi.updateVictim(id, updates);
    fetchVictims();
  };
  const deleteVictim = async (id) => {
    await mockApi.deleteVictim(id);
    fetchVictims();
  };

  // ---------------- Volunteers ----------------
  const [volunteers, setVolunteers] = useState([]);
  const fetchVolunteers = async () => {
    const data = await mockApi.getVolunteers();
    setVolunteers(data);
  };
  const addVolunteer = async (vol) => {
    await mockApi.createVolunteer(vol);
    fetchVolunteers();
  };
  const deleteVolunteer = async (id) => {
    await mockApi.deleteVolunteer(id);
    fetchVolunteers();
  };

  // ---------------- Alerts ----------------
  const [alerts, setAlerts] = useState([]);
  const fetchAlerts = async () => {
    const data = await mockApi.getAlerts();
    setAlerts(data);
  };
  const addAlert = async (alert) => {
    await mockApi.createAlert(alert);
    fetchAlerts();
  };

  // ---------------- Initial Fetch ----------------
   // ---------------- Initial Fetch ----------------
  useEffect(() => {
    fetchVictims();
    fetchVolunteers();
    fetchAlerts();
  }, []);

  // ---------------- Fetch Logged-in User (Skip for Guests) ----------------
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // check if user logged in
      if (!token) {
        console.log("Guest user detected — skipping /api/auth/me fetch");
        return; // don’t call backend for guests
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user info");
          return;
        }

        const data = await response.json();
        setLoggedInUser(data);
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };

    fetchUser();
  }, []);


  return (
    <AppContext.Provider
      value={{
        users,
        loggedInUser,
        setLoggedInUser,
        addUser,
        victims,
        volunteers,
        alerts,
        addVictim,
        updateVictim,
        deleteVictim,
        addVolunteer,
        deleteVolunteer,
        addAlert,
        fetchVictims,
        fetchVolunteers,
        fetchAlerts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
