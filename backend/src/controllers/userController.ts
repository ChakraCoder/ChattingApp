import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { STATUS_CODES } from "../constants/statusCodes";

const prisma = new PrismaClient();

// Fetch all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(STATUS_CODES.OK).json(users);
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch users" });
  }
};
