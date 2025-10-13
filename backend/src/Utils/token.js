// src/utils/token.js
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    // JWT = header.payload.signature (base64url)
    const payload = token.split('.')[1];
    if (!payload) return true;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    return true;
  }
}
