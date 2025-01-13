import { PORT } from "./config";
import { connectDB } from "./config/db";
import app from "./app";

// Initialize database and start the server
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();
