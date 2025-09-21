// Base model interfaces and types for the School Management System

export interface BaseModel {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface BaseInsert {
  id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BaseUpdate {
  id?: number;
  created_at?: string;
  updated_at?: string;
}

// Common enums
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late'
}

export enum LeaveRequestStatus {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PENDING = 'pending'
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  PAST = 'past'
}

export enum EventType {
  HOLIDAY = 'holiday',
  EXAM = 'exam',
  PARENT_MEETING = 'parent_meeting',
  OTHER = 'other'
}

export enum ClassType {
  THEORY = 'theory',
  LAB = 'lab',
  BREAK = 'break',
  LUNCH = 'lunch',
  ACTIVITY = 'activity'
}

export enum SectionType {
  NOTE = 'note',
  VIDEO = 'video',
  ASSIGNMENT = 'assignment'
}

export enum Visibility {
  CLASS = 'class',
  SECTION = 'section',
  SCHOOL = 'school'
}

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending'
}

export enum EnquiryStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  SUPPORT = 'support'
}

export enum ReminderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}

// Common utility types
export type Timestamp = string;
export type DateString = string;
export type TimeString = string;
export type Optional<T> = T | null;
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialField<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and filter types
export interface SearchParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRange {
  startDate?: DateString;
  endDate?: DateString;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  details?: any;
}
