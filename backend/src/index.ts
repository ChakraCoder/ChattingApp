import { PORT } from "./config";
import { connectDB } from "./config/db";
import app from "./app";
import setupSocket from "./socket";
// import fs from "fs";
// import https from "https";
// import os from "os"; // Import os module to get the hostname
// import path from "path";

// Path to SSL certificate and private key
// const privateKey = fs.readFileSync(
//   path.resolve(__dirname, "ssl", "private-key-no-passphrase.pem"),
//   "utf8",
// );
// const certificate = fs.readFileSync(
//   path.resolve(__dirname, "ssl", "certificate.pem"),
//   "utf8",
// );

// const credentials = { key: privateKey, cert: certificate };

// // Initialize database and start the HTTPS serverhttp://chakra-chat.ap-south-1.elasticbeanstalk.com/
// (async () => {
//   await connectDB();
//   const server = https.createServer(credentials, app).listen(PORT, () => {
//     console.log(`Server is running on https://${os.hostname}:${PORT}`);
//   });
//   setupSocket(server);
// })();

// Initialize database and start the server
(async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  setupSocket(server);
})();
