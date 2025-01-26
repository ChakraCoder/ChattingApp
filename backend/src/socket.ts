import { Server } from "http";
import { Socket, Server as SocketIoServer } from "socket.io";
import {
  FRONTEND_DEPLOYED_URL,
  FRONTEND_DEVELOPMENT_URL,
  FRONTEND_ENV,
} from "./config";

const setupSocket = (server: Server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: `${FRONTEND_ENV === "development" ? FRONTEND_DEVELOPMENT_URL : FRONTEND_DEPLOYED_URL}`,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket: Socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }

    socket.on("disconnect", () => disconnect(socket));
  });
};
export default setupSocket;
