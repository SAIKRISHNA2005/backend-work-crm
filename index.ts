import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db";
import authRoutes from "./routes/authRoutes";
import timetableRoutes from "./routes/timetableRoutes";
import examsRoutes from "./routes/examsRoutes";
import subjectsRoutes from "./routes/subjectsRoutes";
import marksRoutes from "./routes/marksRoutes";
import eventsRoutes from "./routes/eventsRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
    credentials: true, // allow cookies
  })
);

// Routes
app.use("/user", authRoutes);
app.use("/timetable", timetableRoutes);
app.use("/exams", examsRoutes);
app.use("/subjects", subjectsRoutes);
app.use("/marks", marksRoutes);
app.use("/events", eventsRoutes);
app.use("/attendance", attendanceRoutes);

// DB Connection
connectDB();

// Server
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
