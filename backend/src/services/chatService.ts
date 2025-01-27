import { prisma } from "../config/db";
import { IndividualChatCreatedError } from "../errors/chatError";

export const addIndividualChatService = async ({
  isGroupChat,
  participants,
}: {
  isGroupChat: boolean;
  participants: string[];
}) => {
  // Check if a chat already exists with the same participants
  const existingChat = await prisma.chat.findFirst({
    where: {
      isGroupChat: false,
      participants: {
        some: {
          userId: {
            in: participants,
          },
        },
      },
    },
  });

  if (existingChat) {
    throw new IndividualChatCreatedError();
  }
  const chat = await prisma.chat.create({
    data: {
      isGroupChat,
      participants: {
        create: participants.map((userId) => ({
          userId,
        })),
      },
    },
  });
  return chat;
};

export const addGroupChatService = async ({
  isGroupChat,
  groupName,
  participants,
}: {
  isGroupChat: boolean;
  groupName: string;
  participants: string[];
}) => {
  const chat = await prisma.chat.create({
    data: {
      isGroupChat,
      groupName,
      participants: {
        create: participants.map((userId) => ({
          userId,
        })),
      },
    },
  });
  return chat;
};

export const getAllChatService = async ({ userId }: { userId: string }) => {
  // Fetch all chats where the user is a participant
  const chats = await prisma.chat.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              userName: true,
              profileImage: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          timestamp: "desc",
        },
        take: 1, // Fetch the latest message for each chat
      },
    },
  });

  // Return the fetched chats
  return chats.map((chat) => ({
    id: chat.id,
    isGroupChat: chat.isGroupChat,
    groupName: chat.groupName,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    participants: chat.participants.map((participant) => ({
      id: participant.user.id,
      firstName: participant.user.firstName,
      lastName: participant.user.lastName,
      userName: participant.user.userName,
      profileImage: participant.user.profileImage,
    })),
    latestMessage: chat.messages[0]
      ? {
          id: chat.messages[0].id,
          type: chat.messages[0].type,
          content: chat.messages[0].content,
          mediaUrl: chat.messages[0].mediaUrl,
          fileName: chat.messages[0].fileName,
          timestamp: chat.messages[0].timestamp,
          senderId: chat.messages[0].senderId,
        }
      : null,
  }));
};
