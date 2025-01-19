import { isAuthenticated } from "@/utils/isAuthenticated";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  if (isAuthenticated()) {
    return <Navigate to="/chat" />;
  }
  return <Outlet />;
};

export default AuthRoutes;
