import { prisma } from "../config/db";

export const searchContactsService = async ({
  searchTerm,
  userId,
}: {
  searchTerm: string;
  userId: string;
}) => {
  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: userId } },
        {
          OR: [
            { userName: { startsWith: searchTerm, mode: "insensitive" } },
            { email: { startsWith: searchTerm, mode: "insensitive" } },
          ],
        },
      ],
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      userName: true,
    },
  });

  return users;
};
