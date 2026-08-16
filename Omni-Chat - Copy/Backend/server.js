import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { createServer } from "http";
import { initSocket } from "./src/sockets/server.socket.js";

connectDB();

const httpServer = createServer(app);
initSocket(httpServer)

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});