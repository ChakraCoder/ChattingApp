import { Button } from "@/components/ui/button";
import { RiCloseFill } from "react-icons/ri";
import { closeChat } from "@/app/slice/chatSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useErrorHandler } from "@/hooks";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  BACKEND_DEPLOYED_URL,
  BACKEND_DEVELOPMENT_URL,
  NODE_ENV,
} from "@/constants/env";

const ChatHeader = () => {
  const handleError = useErrorHandler();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { selectedChatData }: any = useAppSelector((state) => state.chat);

  const chatClose = () => {
    try {
      dispatch(closeChat());
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between">
      <div className="flex gap-5 items-center w-full justify-between px-5 mt-1">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              <AvatarImage
                src={
                  selectedChatData.profileImage !== null
                    ? `${
                        NODE_ENV === "development"
                          ? BACKEND_DEVELOPMENT_URL
                          : BACKEND_DEPLOYED_URL
                      }/profile-images/${selectedChatData.profileImage}`
                    : "/no-profile.jpg"
                }
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            </Avatar>
          </div>
          <div>
            <p className="text-white mb-1">
              {selectedChatData.firstName &&
                selectedChatData.lastName &&
                `${selectedChatData.firstName} ${selectedChatData.lastName}`}
            </p>
            <p className="text-white">
              {selectedChatData.userName && `${selectedChatData.userName} `}
            </p>
          </div>
        </div>
        <div className="flex gap-5 items-center justify-center">
          <Button
            onClick={chatClose}
            className="text-neutral-200 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiCloseFill className="text-3xl" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
