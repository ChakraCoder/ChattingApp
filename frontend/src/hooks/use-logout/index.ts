import { useNavigate } from "react-router-dom";
import { persistor } from "../../app/store";
import { useToast } from "@/hooks";
import { useDispatch } from "react-redux";
import { clearUser } from "@/app/slice/userSlice";
import { clearChat } from "@/app/slice/chatSlice";

const useLogout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      dispatch(clearUser());
      dispatch(clearChat());
      await persistor.purge();
      localStorage.removeItem("auth_token");
      navigate("/auth");
      toast({ description: "User logged out successfully." });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        description: "Logout failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return logout;
};

export default useLogout;
