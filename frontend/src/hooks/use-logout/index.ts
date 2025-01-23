import { useNavigate } from "react-router-dom";
import { persistor } from "../../app/store";
import { useToast } from "@/hooks";

const useLogout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = async () => {
    try {
      await persistor.purge();
      localStorage.removeItem("auth_token");
      navigate("/auth");
      toast({ description: "User Logout Successfully" });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return logout;
};

export default useLogout;
