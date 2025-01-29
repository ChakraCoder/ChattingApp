import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import {
  authRoutes,
  chatRoutes,
  contactsRoutes,
  messagRoutes,
  userRoutes,
} from "./routes";
import { errorHandler } from "./middlewares/errorMiddleware";
import path from "path";
import {
  FRONTEND_DEPLOYED_URL,
  FRONTEND_DEVELOPMENT_URL,
  FRONTEND_ENV,
} from "./config";

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: `${FRONTEND_ENV === "development" ? FRONTEND_DEVELOPMENT_URL : FRONTEND_DEPLOYED_URL}`,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads/profiles")));
app.use(express.static(path.join(__dirname, "uploads/files")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messagRoutes);

// Error handling
app.use(errorHandler);

export default app;
