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
