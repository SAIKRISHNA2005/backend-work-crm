import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser"

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/user", authRoutes);

// DB Connection
connectDB();

// Server
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
