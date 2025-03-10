import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/snappy"; // Default to local DB

// CORS Configuration
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Static File Serving
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

// MongoDB Connection Events for Debugging
mongoose.connection.on("connected", () => console.log("🔗 MongoDB Connection Established"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB Connection Error:", err));
mongoose.connection.on("disconnected", () => console.warn("⚠️ MongoDB Disconnected"));

// Start Server Only After DB Connects
const startServer = async () => {
  await connectDB(); // Ensure DB is connected first

  const server = app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
  });

  setupSocket(server);
};

// Start the Application
startServer();
