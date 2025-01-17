import { isAuthenticated } from "@/utils/isAuthenticated";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
