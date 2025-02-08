import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  addChatData,
  addMessage,
  updateLatestMessageOfExistingChat,
  setTypingIndicator,
  clearTypingIndicator,
  readSelectedChatMessages,
  setAllExistingChatsData,
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
  const { selectedChatDetails, allExistingChatsData, selectedChatMessages } =
    useAppSelector((state) => state.chat);
  const selectedChatRef = useRef(selectedChatDetails);
  const allExistingChatsRef = useRef(allExistingChatsData);
  const selectedChatMessagesRef = useRef(selectedChatMessages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    allExistingChatsRef.current = allExistingChatsData;
  }, [allExistingChatsData]);

  useEffect(() => {
    selectedChatMessagesRef.current = selectedChatMessages;
  }, [selectedChatMessages]);

  useEffect(() => {
    selectedChatRef.current = selectedChatDetails;
  }, [selectedChatDetails]);

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
        console.log("inn1");

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

            setTimeout(() => {
              dispatch(clearTypingIndicator({ chatId: data.chatId }));
            }, 3000);
          }
        }
      );

      socket.current.on(
        "messagesRead",
        ({ userId }: { userId: string; chatId: string }) => {
          selectedChatMessagesRef.current.forEach((message: Message) => {
            if (!message.readBy.includes(userId)) {
              dispatch(
                readSelectedChatMessages({ messageId: message.id, userId })
              );
            }
          });
        }
      );

      // socket.current.on(
      //   "updateUnreadCount",
      //   ({ chatId, unreadCount }: { chatId: string; unreadCount: number }) => {
      //     console.log("inn2");

      //     const updatedChats = allExistingChatsRef.current.map((existingChat) =>
      //       existingChat.id === chatId
      //         ? { ...existingChat, unreadCount }
      //         : existingChat
      //     );
      //     console.log(updatedChats);
      //     dispatch(setAllExistingChatsData(updatedChats));
      //   }
      // );

      socket.current.on(
        "updateUnreadCount",
        ({ chatId, unreadCount }: { chatId: string; unreadCount: number }) => {
          // Ensure the chat already exists in the state
          const existingChat = allExistingChatsRef.current.find(
            (chat) => chat.id === chatId
          );

          if (!existingChat) {
            setTimeout(() => {
              const existingChat = allExistingChatsRef.current.find(
                (chat) => chat.id === chatId
              );
              if (existingChat) {
                const updatedChats = allExistingChatsRef.current.map((chat) =>
                  chat.id === chatId ? { ...chat, unreadCount } : chat
                );
                dispatch(setAllExistingChatsData(updatedChats));
                return;
              }
            }, 1000);
          }

          // Now update the unread count
          const updatedChats = allExistingChatsRef.current.map((chat) =>
            chat.id === chatId ? { ...chat, unreadCount } : chat
          );
          dispatch(setAllExistingChatsData(updatedChats));
        }
      );

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [userInfo, dispatch]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
