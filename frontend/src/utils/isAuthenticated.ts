import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
  const authToken = localStorage.getItem("auth_token");

  if (!authToken) {
    return false; // No token found
  }

  try {
    // 1. Check if it's a JWT (most common for auth tokens)
    const decodedToken = jwtDecode(authToken);

    // 2. Check for expiry (if it's a JWT)
    if (decodedToken.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decodedToken.exp < currentTime) {
        // Token has expired
        localStorage.removeItem("auth_token"); // Optionally remove expired token
        return false;
      }
    } else {
      console.warn(
        "Token is missing expiry claim (exp). Consider using JWTs for proper expiry management."
      );
      // If not JWT, you may need to implement other expiry check if applicable
      // Or you might decide to always treat it as valid if it exists.
      return true; // if no expiry claim, consider token is valid
    }

    // 3. If it's not a JWT or if it's a JWT and has not expired
    return true;
  } catch (error) {
    // Handle invalid token (e.g., malformed JWT)
    console.error("Error decoding token:", error);
    localStorage.removeItem("auth_token"); // Remove potentially invalid token
    return false;
  }
};
