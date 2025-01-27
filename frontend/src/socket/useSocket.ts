import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

type SocketContextType = Socket | null;

// Create the SocketContext
export const SocketContext = createContext<SocketContextType>(null);

// Hook to access the SocketContext
export const useSocket = (): SocketContextType => {
  return useContext(SocketContext);
};
