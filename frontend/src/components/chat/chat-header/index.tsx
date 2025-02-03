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
import { Participant } from "@/types/chatTypes";

const ChatHeader = () => {
  const handleError = useErrorHandler();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { selectedChatDetails }: any = useAppSelector((state) => state.chat);

  // Compute the other participant for individual chats
  const receiptientDetails =
    !selectedChatDetails.isGroupChat &&
    selectedChatDetails.participants.find((p: Participant) => p.id !== userId);

  const chatClose = () => {
    try {
      dispatch(closeChat());
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      {receiptientDetails && (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between">
          <div className="flex gap-5 items-center w-full justify-between px-5 mt-1">
            <div className="flex gap-3 items-center justify-center">
              <div className="w-12 h-12 relative">
                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                  <AvatarImage
                    src={
                      selectedChatDetails.chatType === "GROUP"
                        ? "/group-chat.png"
                        : receiptientDetails.profileImage
                        ? `${
                            NODE_ENV === "development"
                              ? BACKEND_DEVELOPMENT_URL
                              : BACKEND_DEPLOYED_URL
                          }/${receiptientDetails.profileImage}`
                        : "/no-profile.jpg"
                    }
                    alt="profile"
                    className="object-cover w-full h-full bg-white"
                  />
                </Avatar>
              </div>
              {selectedChatDetails.chatType === "GROUP" ? (
                <div>
                  <p className="text-white">{selectedChatDetails.groupName}</p>
                </div>
              ) : (
                <div>
                  <p className="text-white mb-1">
                    {receiptientDetails.firstName &&
                      receiptientDetails.lastName &&
                      `${receiptientDetails.firstName} ${receiptientDetails.lastName}`}
                  </p>
                  <p className="text-white">
                    {receiptientDetails.userName &&
                      `${receiptientDetails.userName} `}
                  </p>
                </div>
              )}
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
      )}
    </>
  );
};

export default ChatHeader;
