import { prisma } from "../config/db";

export const getChatMessagesService = async ({
  chatId,
}: {
  chatId: string;
}) => {
  const chats = await prisma.message.findMany({
    where: {
      chatId,
    },
    include: {
      sender: {
        select: {
          userName: true,
          profileImage: true,
        },
      },
    },
  });

  return chats;
};

import path from "path";

export const uploadFileService = async ({
  fileName,
  mediaUrl,
}: {
  fileName: string;
  mediaUrl: string;
}) => {
  // Define image extensions
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tiff",
    ".webp",
    ".heic",
    ".heif",
  ];

  // Get file extension
  const fileExtension = path.extname(fileName).toLowerCase();

  // Determine type based on extension
  const type = imageExtensions.includes(fileExtension) ? "IMAGE" : "FILE";

  return { fileName, mediaUrl, type };
};
