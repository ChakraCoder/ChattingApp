import { useState, useEffect } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("auth_token");
    setIsAuthenticated(!!authToken);
  }, []);

  return { isAuthenticated };
};

export default useAuth;
