import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { FileSizeIsTooLarge } from "../errors/chatError";

// Configure storage for profile images
const filesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../opt/render/uploads/files"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Extract file extension
    cb(null, `${file.originalname.replace(ext, "")}-${uniqueSuffix}${ext}`);
  },
});

// Multer configuration
const upload = multer({
  storage: filesStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("file");

// Middleware to handle Multer errors
export const fileUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new FileSizeIsTooLarge());
      }
      return next(err);
    } else if (err) {
      return next(new Error("File upload failed."));
    }
    next();
  });
};
