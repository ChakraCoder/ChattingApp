import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/app/hooks";
import {
  BACKEND_DEPLOYED_URL,
  BACKEND_DEVELOPMENT_URL,
  NODE_ENV,
} from "@/constants/env";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { LogOut, Edit } from "lucide-react";
import useLogout from "@/hooks/use-logout";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const user = useAppSelector((state) => state.user);

  const profileImagePath = user.profileImage
    ? `${
        NODE_ENV === "development"
          ? BACKEND_DEVELOPMENT_URL
          : BACKEND_DEPLOYED_URL
      }/${user.profileImage}`
    : "/no-profile.jpg";

  return (
    <div className="absolute bottom-0 h-24 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            <AvatarImage
              src={profileImagePath}
              alt="profile"
              className="object-cover w-full h-full bg-black"
            />
          </Avatar>
        </div>
        <div>
          <p className="text-white mb-1">
            {user.firstName &&
              user.lastName &&
              `${user.firstName} ${user.lastName}`}
          </p>
          <p className="text-white">{user.userName && `${user.userName} `}</p>
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Edit
                className="text-purple-500 text-xl font-medium"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <LogOut
                className="text-red-500 text-xl font-medium"
                onClick={logout}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
