import { Request } from "express";

// Extend Express Request interface to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Common API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User roles
export type UserRole = "student" | "teacher" | "admin" | "super_admin";

// Common pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

// Common query filters
export interface QueryFilters {
  search?: string;
  classId?: string;
  subjectId?: string;
  teacherId?: string;
  studentId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// JWT Payload
export interface JwtPayload {
  id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// File upload types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// Error types
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Database document with common fields
export interface BaseDocument {
  id: number;
  created_at: string;
  updated_at: string;
}

// Attendance status
export type AttendanceStatus = "present" | "absent" | "late" | "excused";

// Leave status
export type LeaveStatus = "pending" | "approved" | "rejected";

// Fee status
export type FeeStatus = "paid" | "pending" | "partial" | "overdue";

// Exam types
export type ExamType = "unit_test" | "mid_term" | "final" | "assignment" | "quiz";

// Event categories
export type EventCategory = "Cultural" | "Academic" | "Educational" | "Sports" | "Other";

// Event status
export type EventStatus = "Upcoming" | "Ongoing" | "Past" | "Cancelled";

// Note visibility levels
export type VisibilityLevel = "class" | "section" | "all";

// Class types
export type ClassType = "Theory" | "Lab" | "Activity" | "Break" | "Lunch";

// Grade types
export type GradeType = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";

// Salary status
export type SalaryStatus = "credited" | "pending" | "overdue";

// Blood groups
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
