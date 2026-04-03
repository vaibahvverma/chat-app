import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import rateLimit from "express-rate-limit";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";

dotenv.config();

// middleware
app.use(express.json());
app.use(cookieParser());

const corsOrigin =
  process.env.NODE_ENV === "production"
    ? true // same-origin in production
    : process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"];

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

const PORT = process.env.PORT || 4001;
const URI = process.env.MONGODB_URI;

try {
  mongoose.connect(URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

// rate limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per windowMs for auth
  message: "Too many login/signup attempts from this IP, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// apply limiters
app.use("/api/user/signup", authLimiter);
app.use("/api/user/login", authLimiter);
app.use("/api", apiLimiter);

//routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// Serve static files from the React frontend app
if(process.env.NODE_ENV === "production"){
  const dirPath = path.resolve();
  app.use(express.static("./Frontend/dist"));
  app.get("*", (req, res) => {  
    res.sendFile(path.join(dirPath, "./Frontend/dist","index.html"));
})};


server.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
