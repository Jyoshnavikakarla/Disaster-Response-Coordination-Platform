// src/utils/apiFetch.js
export async function apiFetch(path, options = {}, { autoLogout } = {}) {
  // path e.g. "/api/recommendations/123"
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`http://localhost:5000${path}`, {
    ...options,
    headers,
  });

  // if unauthorized -> token expired or invalid
  if (res.status === 401 || res.status === 403) {
    // optional callback to clear context and localStorage
    if (typeof autoLogout === "function") autoLogout();
    else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("loggedInUser");
    }
    throw new Error("Unauthorized");
  }

  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}
