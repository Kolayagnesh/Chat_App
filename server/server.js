import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import socketHandler from "./src/sockets/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"]
    }
  });

  // make io available to controllers
  global.io = io;

  socketHandler(io);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
