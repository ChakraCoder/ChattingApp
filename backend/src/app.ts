import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { authRoutes, userRoutes } from "./routes";
import { errorHandler } from "./middlewares/errorMiddleware";
import path from "path";

const app: Application = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(errorHandler);

export default app;
