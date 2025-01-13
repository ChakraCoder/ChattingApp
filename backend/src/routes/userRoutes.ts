import express from "express";
import { getAllUsers } from "../controllers/userController";

const userRouter = express.Router();

// Routes for user operations
userRouter.get("/", getAllUsers);

export default userRouter;
