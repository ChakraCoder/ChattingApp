import express, { Application } from "express";
import cors from "cors";
import fs from "fs";
// import helmet from "helmet";
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
  NODE_ENV,
} from "./config";

const app: Application = express();

// app.use(
//   helmet({
//     contentSecurityPolicy: false, // Adjust as needed
//   }),
// );

// Middleware to force HTTPS in production environments
// if (NODE_ENV === "production") {
//   app.use((req, res, next) => {
//     if (!req.secure) {
//       res.redirect("https://" + req.hostname + req.url);
//     } else {
//       next();
//     }
//   });
// }

const profileUploadDir = path.join("/opt/render/uploads/profiles");
const fileUploadDir = path.join("/opt/render/uploads/files");

// Ensure the directory exists
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
}

if (!fs.existsSync(fileUploadDir)) {
  fs.mkdirSync(fileUploadDir, { recursive: true });
}

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
app.use(express.static(path.join(__dirname, "/opt/render/uploads/profiles")));
app.use(express.static(path.join(__dirname, "/opt/render/uploads/files")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messagRoutes);

// Error handling
app.use(errorHandler);

export default app;
