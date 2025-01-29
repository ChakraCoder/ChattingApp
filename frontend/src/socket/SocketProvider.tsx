import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addMessage } from "@/app/slice/chatSlice";
import {
  BACKEND_DEPLOYED_URL,
  BACKEND_DEVELOPMENT_URL,
  NODE_ENV,
} from "@/constants/env";
import { Message } from "@/types/chatTypes";
import { SocketContext } from "./useSocket";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useRef<Socket | null>(null);
  const userInfo = useAppSelector((state) => state.user);
  const { selectedChatDetails } = useAppSelector((state) => state.chat);
  const selectedChatRef = useRef(selectedChatDetails);
  const dispatch = useAppDispatch();

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
        if (
          selectedChatRef.current &&
          selectedChatRef.current.id === message.chatId
        ) {
          dispatch(addMessage(message));
        }
      });

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
