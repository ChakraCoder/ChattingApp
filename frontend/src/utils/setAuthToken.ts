import axios from "axios";

const setAuthToken = (token: string | null) => {
  if (token) {
    // Set the token in the Authorization header
    localStorage.setItem("auth_token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Remove the Authorization header
    localStorage.removeItem("auth_token");
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
