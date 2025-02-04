import { useAppSelector } from "@/app/hooks";
import {
  setSelectedChatDetails,
  setAllExistingChatsData,
} from "@/app/slice/chatSlice";
import { AvatarImage } from "@/components/ui/avatar";
import {
  BACKEND_DEPLOYED_URL,
  BACKEND_DEVELOPMENT_URL,
  NODE_ENV,
} from "@/constants/env";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/socket/useSocket";
import { ChatDetails } from "@/types/chatTypes";
import { Avatar } from "@radix-ui/react-avatar";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Chats = () => {
  const [chats, setChats] = useState<ChatDetails[]>([]);
  const socket = useSocket();
  const userId = useAppSelector((state) => state.user.id);
  const dispatch = useDispatch();
  const { allExistingChatsData, selectedChatDetails } = useAppSelector(
    (state) => state.chat
  );

  useEffect(() => {
    const fetchChats = () => {
      setChats(allExistingChatsData);
    };

    fetchChats();
  }, [allExistingChatsData, userId, selectedChatDetails]);

  // Handle clicking on a chat
  const handleClick = (chat: ChatDetails) => {
    if (selectedChatDetails?.id !== chat.id) {
      if (socket) {
        socket.emit("leaveChat", { userId, chatId: selectedChatDetails?.id });
      }

      const { id, groupName, participants, createdAt, updatedAt } = chat;
      dispatch(
        setSelectedChatDetails({
          id,
          groupName,
          participants,
          chatType: chat.isGroupChat ? "GROUP" : "INDIVIDUAL",
          createdAt,
          updatedAt,
        })
      );

      const updatedChats = allExistingChatsData.map((existingChat) =>
        existingChat.id === id
          ? { ...existingChat, unreadCount: 0 }
          : existingChat
      );

      dispatch(setAllExistingChatsData(updatedChats));

      if (socket) {
        socket.emit("joinChat", {
          userId,
          chatId: id,
        });
      }
    }
  };

  return (
    <div>
      <ul>
        {chats.map((chat, index) => {
          // For individual chats, find the participant that is not the logged-in user.
          const otherParticipant = !chat.isGroupChat
            ? chat.participants.find((p) => p.id !== userId)
            : null;

          return (
            <li
              key={index}
              className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
                selectedChatDetails?.id === chat.id
                  ? "bg-[#f1f1f111]"
                  : "hover:bg-[#f1f1f111]"
              }`}
              onClick={() => handleClick(chat)}
            >
              <div className="flex gap-5 items-center justify-start text-neutral-300">
                <div className="w-12 h-12 relative">
                  <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                    <AvatarImage
                      src={
                        chat.isGroupChat
                          ? "/group-chat.png"
                          : otherParticipant?.profileImage
                          ? `${
                              NODE_ENV === "development"
                                ? BACKEND_DEVELOPMENT_URL
                                : BACKEND_DEPLOYED_URL
                            }/${otherParticipant.profileImage}`
                          : "/no-profile.jpg"
                      }
                      alt="profile"
                      className="object-cover w-full h-full bg-white rounded-full"
                    />
                  </Avatar>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex flex-row">
                    <p className="text-white text-base">
                      {chat.isGroupChat
                        ? chat.groupName
                        : otherParticipant?.userName}
                    </p>
                    <div className="flex w-full px-4 justify-end items-end">
                      <p
                        className={
                          chat.unreadCount > 0
                            ? "text-green-500 my-1 text-sm"
                            : "text-gray-400 my-1 text-sm"
                        }
                      >
                        {chat.latestMessage?.timestamp
                          ? moment(chat.latestMessage.timestamp).format("LT")
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center">
                    {/* Left Side - Message Preview */}
                    <div className="flex justify-start items-start">
                      <p className="text-gray-400 my-1 text-sm">
                        {(() => {
                          const message = chat.latestMessage;
                          const content = message?.content || message?.fileName;

                          // Find sender in participants
                          const sender = chat.participants.find(
                            (participant) =>
                              participant.id === message?.senderId
                          );

                          const senderName = sender
                            ? sender.userName
                            : "Unknown";

                          if (chat.isGroupChat) {
                            if (content && content.length > 30) {
                              return (
                                <span className="text-gray-600">
                                  ~ {senderName}: {content.slice(0, 28)}...
                                </span>
                              );
                            }
                            return `${senderName}: ${
                              content || "No recent messages"
                            }`;
                          } else {
                            if (content && content.length > 30) {
                              return `${content.slice(0, 28)}...`;
                            }
                            return content || "No recent messages";
                          }
                        })()}
                      </p>
                    </div>

                    {/* Right Side - Unread Badge */}
                    {chat.unreadCount > 0 && (
                      <div className="flex justify-end items-center">
                        <Badge className="bg-green-500 text-black mx-3 font-bold">
                          {chat.unreadCount}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Chats;
