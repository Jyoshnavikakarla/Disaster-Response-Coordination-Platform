// src/api/mockApi.js
let victims = [
  { id: "v_001", name: "John Doe", location: "Sector 7", contact: "9876543210", helpType: "Medical", status: "Pending" }
];

let volunteers = [
  { id: "vol_001", name: "Sample Volunteer", contact: "1234567890", resources: "Food, Water", skills: "Transport" }
];

let alerts = [
  { id: "a_001", message: "Flood warning in Sector 7", severity: "High" }
];

// ----- Victim API -----
export async function getVictims() {
  return victims;
}

export async function createVictim(data) {
  const newVictim = { id: "v_" + (victims.length + 1), status: "Pending", ...data };
  victims.push(newVictim);
  console.log("Victim added:", newVictim); //  Debug log
  return newVictim;
}

export async function updateVictim(id, updates) {
  victims = victims.map(v => v.id === id ? { ...v, ...updates } : v);
  return victims.find(v => v.id === id);
}

export async function deleteVictim(id) {
  victims = victims.filter(v => v.id !== id);
  return { message: "Victim deleted" };
}

// ----- Volunteer API -----
export async function getVolunteers() {
  return volunteers;
}

export async function createVolunteer(data) {
  const newVolunteer = { id: "vol_" + (volunteers.length + 1), ...data };
  volunteers.push(newVolunteer);
  return newVolunteer;
}

export async function deleteVolunteer(id) {
  volunteers = volunteers.filter(v => v.id !== id);
  return { message: "Volunteer deleted" };
}

// ----- Alerts API -----
export async function getAlerts() {
  return alerts;
}

export async function createAlert(data) {
  const newAlert = { id: "a_" + (alerts.length + 1), ...data };
  alerts.push(newAlert);
  return newAlert;
}
