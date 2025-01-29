import multer from "multer";
import path from "path";

// Configure storage for profile images
const filesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use path to ensure compatibility across platforms
    cb(null, path.resolve(__dirname, "../uploads/files"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Extract file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Multer configuration
export const fileUpload = multer({
  storage: filesStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },
});
