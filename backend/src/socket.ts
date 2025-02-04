import { Server } from "http";
import { Socket, Server as SocketIoServer } from "socket.io";
import { prisma } from "./config/db";
import {
  FRONTEND_DEPLOYED_URL,
  FRONTEND_DEVELOPMENT_URL,
  FRONTEND_ENV,
} from "./config";

// Map to track active users per chat.
// The key is the chat ID, and the value is a Set of user IDs active in that chat.
const activeUsersInChat = new Map<string, Set<string>>();

const setupSocket = (server: Server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: `${
        FRONTEND_ENV === "development"
          ? FRONTEND_DEVELOPMENT_URL
          : FRONTEND_DEPLOYED_URL
      }`,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Map to store userId-to-socketId associations
  const userSocketMap = new Map<string, string>();

  // Handle user disconnection
  const handleDisconnect = (socket: Socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    // Remove the user from userSocketMap and from any active chat sets
    let disconnectedUserId: string | undefined;
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        userSocketMap.delete(userId);
        break;
      }
    }
    // Remove the disconnected user from any active chat they were part of
    if (disconnectedUserId) {
      for (const [chatId, activeUsers] of activeUsersInChat.entries()) {
        if (activeUsers.has(disconnectedUserId)) {
          activeUsers.delete(disconnectedUserId);
          console.log(
            `Removed user ${disconnectedUserId} from activeUsersInChat for chat ${chatId}`,
          );
          // Optionally, emit an update to other clients that the user left
          io.to(chatId).emit("userLeftChat", {
            userId: disconnectedUserId,
            chatId,
          });
        }
      }
    }
  };

  // When a user joins a chat, add them to the active users map.
  const socketJoinChat = (
    data: { userId: string; chatId: string },
    socket: Socket,
    io: SocketIoServer,
  ) => {
    const { userId, chatId } = data;
    let activeUsers = activeUsersInChat.get(chatId);
    if (!activeUsers) {
      activeUsers = new Set();
      activeUsersInChat.set(chatId, activeUsers);
    }
    activeUsers.add(userId);
    console.log(
      `User ${userId} joined chat ${chatId}. Active users:`,
      Array.from(activeUsers),
    );
    // Join the socket room for easier emits
    socket.join(chatId);
    // Notify others in the chat about the new active user.
    io.to(chatId).emit("userJoinedChat", { userId, chatId });
  };

  // When a user leaves a chat, remove them from the active users map.
  const socketLeaveChat = (
    data: { userId: string; chatId: string },
    socket: Socket,
    io: SocketIoServer,
  ) => {
    const { userId, chatId } = data;
    const activeUsers = activeUsersInChat.get(chatId);
    if (activeUsers && activeUsers.has(userId)) {
      activeUsers.delete(userId);
      console.log(
        `User ${userId} left chat ${chatId}. Active users:`,
        Array.from(activeUsers),
      );
      // Have the socket leave the room.
      socket.leave(chatId);
      io.to(chatId).emit("userLeftChat", { userId, chatId });
    }
  };

  // Handler: When a message is sent, mark it as read immediately for active users.
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

      // Determine which participants are active in this chat
      const activeUsers = activeUsersInChat.get(chatId) || new Set();
      const updatedMessage = {
        ...createdMessage,
        // Mark the message as read by those active in the chat
        readBy: [...createdMessage.readBy, ...Array.from(activeUsers)],
      };

      // Update the message readBy field in the database as needed
      await prisma.message.update({
        where: { id: createdMessage.id },
        data: { readBy: updatedMessage.readBy },
      });

      for (const participant of chat.participants) {
        const participantSocketId = userSocketMap.get(participant.userId);
        if (participantSocketId) {
          // Send the new message.
          io.to(participantSocketId).emit("newMessage", updatedMessage);

          // If the participant is not active in this chat, update their unread count.
          // if (!activeUsers.has(participant.userId)) {
          // Calculate unread count for this participant in this chat.
          // (This example uses a simple query; adjust the logic as needed.)
          const unreadCount = await prisma.message.count({
            where: {
              chatId,
              // Assuming your message model stores `readBy` as an array field.
              NOT: {
                readBy: {
                  has: participant.userId,
                },
              },
            },
          });
          console.log("unread", unreadCount);

          io.to(participantSocketId).emit("updateUnreadCount", {
            chatId,
            unreadCount,
          });
        }
      }
      // }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error in handleSendMessage:", error.message);
    }
  };

  // Handle typing events using the activeUsersInChat map.
  const handleSenderTyping = async (data: {
    senderId: string;
    chatId: string;
  }) => {
    try {
      const { senderId, chatId } = data;
      const activeUsers = activeUsersInChat.get(chatId) || new Set();
      activeUsers.forEach((userId) => {
        // Avoid sending the event back to the sender.
        if (userId !== senderId) {
          const recipientSocketId = userSocketMap.get(userId);
          if (recipientSocketId) {
            io.to(recipientSocketId).emit("senderTyping", { senderId, chatId });
          }
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error in handleSenderTyping:", error.message);
    }
  };

  // Handler for read message: mark messages as read upon joining a chat.
  const handleReadMessage = async (data: {
    userId: string;
    chatId: string;
  }) => {
    try {
      const { userId, chatId } = data;
      await prisma.message.updateMany({
        where: {
          chatId,
          NOT: {
            readBy: {
              has: userId,
            },
          },
        },
        data: {
          readBy: {
            push: userId,
          },
        },
      });
      io.to(chatId).emit("messagesRead", { userId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error in handleReadMessage:", error.message);
    }
  };

  // Socket connection
  io.on("connection", (socket: Socket) => {
    // Get userId from the handshake query
    const userId = socket.handshake.query.userId as string;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }

    // When a user opens a chat:
    socket.on("joinChat", (data: { userId: string; chatId: string }) => {
      socketJoinChat(data, socket, io);
    });

    // When a user closes a chat:
    socket.on("leaveChat", (data: { userId: string; chatId: string }) => {
      socketLeaveChat(data, socket, io);
    });

    socket.on("sendMessage", handleSendMessage);
    socket.on("senderTyping", handleSenderTyping);
    socket.on("readMessage", handleReadMessage);

    socket.on("disconnect", () => {
      handleDisconnect(socket);
    });
  });
};

export default setupSocket;
