import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import { OnlyImageFileAreAllowed } from "../errors/userError";

// Configure storage for profile images
const profileImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use path to ensure compatibility across platforms
    cb(null, path.resolve(__dirname, "../public/profile-images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Extract file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter for image uploads
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMimeTypes = /image\//; // Matches any image MIME type
  const allowedExtensions = /\.(jpeg|jpg|png|gif|bmp|tiff|webp|heic|heif)$/i; // Common image extensions

  const mimeType = allowedMimeTypes.test(file.mimetype);
  const extName = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (mimeType && extName) {
    return cb(null, true);
  }

  cb(new OnlyImageFileAreAllowed());
};

// Multer configuration
export const profileImageUpload = multer({
  storage: profileImageStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit file size to 2MB
  },
  fileFilter: fileFilter,
});
