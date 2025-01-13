import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkIfUserExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return !!user;
};

export const checkIfUserNameExists = async (
  userName: string,
): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { userName },
  });
  return !!user;
};
