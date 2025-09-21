import { BaseModel, BaseInsert, BaseUpdate, UserRole, UserStatus } from './base';

// User Model
export interface User extends BaseModel {
  username: string;
  email?: string;
  phone?: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserInsert extends BaseInsert {
  username: string;
  email?: string;
  phone?: string;
  password_hash: string;
  role: UserRole;
  status?: UserStatus;
}

export interface UserUpdate extends BaseUpdate {
  username?: string;
  email?: string;
  phone?: string;
  password_hash?: string;
  role?: UserRole;
  status?: UserStatus;
}

// User without sensitive data
export interface UserPublic {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

// User with profile data
export interface UserWithProfile extends User {
  student_profile?: StudentProfile;
  teacher_profile?: TeacherProfile;
}

// User authentication types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email?: string;
  phone?: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  user: UserPublic;
  token: string;
  refresh_token?: string;
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
}

// User statistics
export interface UserStats {
  total_users: number;
  students_count: number;
  teachers_count: number;
  admins_count: number;
  active_users: number;
  inactive_users: number;
}

// Re-export for convenience
export type { User };
