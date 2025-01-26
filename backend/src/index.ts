import { PORT } from "./config";
import { connectDB } from "./config/db";
import app from "./app";
import setupSocket from "./socket";

// Initialize database and start the server
(async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  setupSocket(server);
})();
