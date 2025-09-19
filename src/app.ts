import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config/environment";
import { logger, loggerStream } from "./utils/logger";
import { securityMiddleware } from "./middleware/security";
import { generalLimiter, authLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFound } from "./middleware/errorHandler";

// Import routes
import authRoutes from "./routes/authRoutes";
import studentRoutes from "./routes/studentRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import classRoutes from "./routes/classRoutes";
import subjectRoutes from "./routes/subjectRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import marksRoutes from "./routes/marksRoutes";
import eventRoutes from "./routes/eventRoutes";
import noteRoutes from "./routes/noteRoutes";
import timetableRoutes from "./routes/timetableRoutes";
import announcementRoutes from "./routes/announcementRoutes";
import teacherNotesRoutes from "./routes/teacherNotesRoutes";
import digitalNotesRoutes from "./routes/digitalNotesRoutes";
import examsRoutes from "./routes/examsRoutes";
import examSubjectsRoutes from "./routes/examSubjectsRoutes";
import academicCalendarRoutes from "./routes/academicCalendarRoutes";
import achievementRoutes from "./routes/achievementRoutes";
import enquiryRoutes from "./routes/enquiryRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";
import feeRoutes from "./routes/feeRoutes";

const app = express();

// Trust proxy for rate limiting and security
app.set('trust proxy', 1);

// Security middleware
app.use(securityMiddleware);

// Logging middleware
app.use(morgan('combined', { stream: loggerStream }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: config.app.nodeEnv
  });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/teacher-notes', teacherNotesRoutes);
app.use('/api/digital-notes', digitalNotesRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/exam-subjects', examSubjectsRoutes);
app.use('/api/academic-calendar', academicCalendarRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/fees', feeRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'School Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      students: '/api/students',
      teachers: '/api/teachers',
      classes: '/api/classes',
      subjects: '/api/subjects',
      attendance: '/api/attendance',
      marks: '/api/marks',
      events: '/api/events',
      notes: '/api/notes',
      timetable: '/api/timetable',
      announcements: '/api/announcements',
      teacherNotes: '/api/teacher-notes',
      digitalNotes: '/api/digital-notes',
      exams: '/api/exams',
      examSubjects: '/api/exam-subjects',
      academicCalendar: '/api/academic-calendar',
      achievements: '/api/achievements',
      enquiries: '/api/enquiries',
      leaderboard: '/api/leaderboard',
      fees: '/api/fees'
    },
    documentation: '/api/docs'
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
