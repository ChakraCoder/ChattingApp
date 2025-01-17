import path from "path";
import fs from "fs";
export const deleteProfileImage = (fileName: string) => {
  const filePath = path.resolve(
    __dirname,
    "../public/profile-images/",
    fileName,
  );

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err.message);
    } else {
      console.log("Profile image deleted successfully:", filePath);
    }
  });
};
