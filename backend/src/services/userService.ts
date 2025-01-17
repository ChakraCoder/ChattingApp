import { PrismaClient } from "@prisma/client";
import { UserNameAlreadyExistError } from "../errors/authError";
import { deleteProfileImage } from "../utils";

const prisma = new PrismaClient();

export const checkIfUserExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return !!user;
};

export const checkIfUserNameExists = async (
  userName: string,
  id: string,
): Promise<boolean> => {
  const user = await prisma.user.findFirst({
    where: {
      userName,
      id: {
        not: id,
      },
    },
  });
  return !!user;
};

export const profileService = async (
  {
    profileImage,
    userName,
  }: {
    profileImage?: string;
    userName: string;
  },
  userId: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { profileImage: true },
  });

  const updateData: { userName: string; profileImage?: string } = {
    userName,
  };

  if (profileImage) {
    if (user?.profileImage) {
      deleteProfileImage(user?.profileImage);
    }
    updateData.profileImage = profileImage;
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
};

export const checkUserNameService = async (
  {
    userName,
  }: {
    userName: string;
  },
  userId: string,
) => {
  const userNameExist = await checkIfUserNameExists(userName, userId);
  if (userNameExist) {
    throw new UserNameAlreadyExistError();
  }
  return true;
};

export const getUserProfileByIdService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      profileImage: true,
      userName: true,
    },
  });
  return { profileImage: user?.profileImage, userName: user?.userName };
};
