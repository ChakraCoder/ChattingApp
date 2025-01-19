import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/app/hooks";
import { FiEdit2 } from "react-icons/fi";
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

const ProfileInfo = () => {
  const user = useAppSelector((state) => state.user);

  const profileImagePath = user.profileImage
    ? `${
        NODE_ENV === "development"
          ? BACKEND_DEVELOPMENT_URL
          : BACKEND_DEPLOYED_URL
      }/profile-images/${user.profileImage}`
    : "/no-profile.jpg";

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
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
          <p className="text-white">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : ""}
          </p>
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2 className="text-purple-500 text-xl font-medium" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
