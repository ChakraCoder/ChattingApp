import { Server } from "http";
import { Socket, Server as SocketIoServer } from "socket.io";
import { prisma } from "./config/db";
import {
  FRONTEND_DEPLOYED_URL,
  FRONTEND_DEVELOPMENT_URL,
  FRONTEND_ENV,
} from "./config";

const setupSocket = (server: Server) => {
  // Initialize Socket.IO with CORS configuration
  const io = new SocketIoServer(server, {
    cors: {
      origin: `${FRONTEND_ENV === "development" ? FRONTEND_DEVELOPMENT_URL : FRONTEND_DEPLOYED_URL}`,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Map to store userId-to-socketId associations
  const userSocketMap = new Map<string, string>();

  // Handle user disconnection
  const handleDisconnect = (socket: Socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`Removed user: ${userId} from userSocketMap`);
        break;
      }
    }
  };

  // Handle sending a message
  const handleSendMessage = async (messageData: {
    senderId: string;
    chatId: string;
    content: string;
    type: "TEXT" | "IMAGE" | "FILE";
    mediaUrl: string;
    fileName: string;
  }) => {
    try {
      const { senderId, chatId, content, type, mediaUrl, fileName } =
        messageData;

      // Validate and fetch chat participants
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { participants: { select: { userId: true } } },
      });

      if (!chat) {
        throw new Error("Chat not found");
      }

      // Ensure sender is part of the chat
      const isSenderInChat = chat.participants.some(
        (p) => p.userId === senderId,
      );
      if (!isSenderInChat) {
        throw new Error("Sender is not a participant of this chat");
      }

      // Create the message
      const createdMessage = await prisma.message.create({
        data: { senderId, chatId, content, type, mediaUrl, fileName },
        include: {
          sender: {
            select: {
              userName: true,
              profileImage: true,
            },
          },
        },
      });

      // Emit the message to all chat participants
      chat.participants.forEach((participant) => {
        const recipientSocketId = userSocketMap.get(participant.userId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("newMessage", createdMessage);
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error in handleSendMessage:", error.message);
    }
  };

  const handleSenderTyping = async (data: {
    senderId: string;
    chatId: string;
  }) => {
    try {
      const { senderId, chatId } = data;

      // Validate and fetch chat participants
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { participants: { select: { userId: true } } },
      });

      if (!chat) {
        throw new Error("Chat not found");
      }

      // Ensure the sender is a participant of the chat
      const isSenderInChat = chat.participants.some(
        (p) => p.userId === senderId,
      );
      if (!isSenderInChat) {
        throw new Error("Sender is not a participant of this chat");
      }

      // Fetch sender's profile information
      const senderInfo = await prisma.user.findUnique({
        where: { id: senderId },
        select: { userName: true, profileImage: true },
      });

      if (!senderInfo) {
        throw new Error("Sender information not found");
      }

      // Emit the typing indicator to all participants except the sender,
      // including sender's username and profileImage.
      chat.participants.forEach((participant) => {
        if (participant.userId !== senderId) {
          const recipientSocketId = userSocketMap.get(participant.userId);
          if (recipientSocketId) {
            io.to(recipientSocketId).emit("senderTyping", {
              senderId,
              chatId,
              userName: senderInfo.userName,
              profileImage: senderInfo.profileImage,
            });
          }
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error in handleSenderTyping:", error.message);
    }
  };

  // Handle socket connection
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string;

    if (userId) {
      // Store user and socket ID in the map
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }

    // Register event handlers
    socket.on("sendMessage", handleSendMessage);
    socket.on("senderTyping", handleSenderTyping);
    socket.on("disconnect", () => handleDisconnect(socket));
  });
};

export default setupSocket;
