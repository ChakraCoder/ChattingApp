import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  addChatData,
  addMessage,
  updateLatestMessageOfExistingChat,
  setTypingIndicator,
  clearTypingIndicator,
} from "@/app/slice/chatSlice";
import {
  BACKEND_DEPLOYED_URL,
  BACKEND_DEVELOPMENT_URL,
  NODE_ENV,
} from "@/constants/env";
import { Message, Participant } from "@/types/chatTypes";
import { SocketContext } from "./useSocket";
import { getUserChat } from "@/apis/chatApiServices";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useRef<Socket | null>(null);
  const userInfo = useAppSelector((state) => state.user);
  const { selectedChatDetails, allExistingChatsData } = useAppSelector(
    (state) => state.chat
  );
  const selectedChatRef = useRef(selectedChatDetails);
  const allExistingChatsRef = useRef(allExistingChatsData);
  const dispatch = useAppDispatch();

  // Update ref whenever chats change
  useEffect(() => {
    allExistingChatsRef.current = allExistingChatsData;
  }, [allExistingChatsData]);

  useEffect(() => {
    if (userInfo) {
      socket.current = io(
        NODE_ENV === "development"
          ? BACKEND_DEVELOPMENT_URL
          : BACKEND_DEPLOYED_URL,
        {
          withCredentials: true,
          query: { userId: userInfo.id },
        }
      );

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket.current.on("newMessage", (message: Message) => {
        const existingChat = allExistingChatsRef.current.find(
          (chat) => chat.id === message.chatId
        );

        if (existingChat) {
          dispatch(
            updateLatestMessageOfExistingChat({
              chatId: message.chatId,
              latestMessage: {
                id: message.id,
                type: message.type,
                content: message.content,
                mediaUrl: message.mediaUrl,
                fileName: message.fileName,
                timestamp: message.updatedAt,
                senderId: message.senderId,
              },
            })
          );
        } else {
          (async () => {
            try {
              const addChat = await getUserChat(message.chatId);
              dispatch(addChatData(addChat.data.data.chat));
            } catch (error) {
              console.error("Error fetching chat:", error);
            }
          })();
        }

        if (
          selectedChatRef.current &&
          selectedChatRef.current.id === message.chatId
        ) {
          dispatch(addMessage(message));
        }
      });

      // Handle senderTyping event with additional sender info
      socket.current.on(
        "senderTyping",
        (data: {
          senderId: string;
          chatId: string;
          userName: string;
          profileImage: string;
        }) => {
          // Only update typing indicator for the currently selected chat
          if (
            selectedChatRef.current &&
            selectedChatRef.current.id === data.chatId
          ) {
            selectedChatRef.current.participants.map(
              (participant: Participant) => {
                if (participant.id === data.senderId) {
                  dispatch(
                    setTypingIndicator({
                      chatId: data.chatId,
                      senderId: data.senderId,
                      userName: participant.userName,
                      profileImage: participant.profileImage,
                    })
                  );
                }
              }
            );
            // Set typing indicator including sender details

            // Optionally clear the indicator after a delay (e.g., 3 seconds)
            setTimeout(() => {
              dispatch(clearTypingIndicator({ chatId: data.chatId }));
            }, 3000);
          }
        }
      );

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    selectedChatRef.current = selectedChatDetails;
  }, [selectedChatDetails]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
