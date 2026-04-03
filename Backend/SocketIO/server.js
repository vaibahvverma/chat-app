import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

// In production, frontend is served from same origin as the backend,
// so we can allow all origins. In dev, restrict to known local ports.
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? true // same-origin in production — no cross-origin
    : process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Returns array of socket IDs for a user (all their connected devices)
export const getReceiverSocketIds = (userId) => {
  return users[userId] || [];
};

// users map: { userId: [socketId1, socketId2, ...] }
const users = {};

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    // Support multiple devices: push this socket into the user's array
    if (!users[userId]) {
      users[userId] = [];
    }
    if (!users[userId].includes(socket.id)) {
      users[userId].push(socket.id);
    }
    console.log(`User ${userId} connected on ${users[userId].length} device(s)`);
  }

  // Broadcast updated online users list to everyone
  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("disconnect", () => {
    console.log("a user disconnected:", socket.id);
    if (userId && users[userId]) {
      // Remove only this specific socket, keep other devices connected
      users[userId] = users[userId].filter((id) => id !== socket.id);
      if (users[userId].length === 0) {
        delete users[userId]; // all devices offline, remove user
      }
    }
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, io, server };
