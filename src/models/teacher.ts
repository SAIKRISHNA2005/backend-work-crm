import { BaseModel, BaseInsert, BaseUpdate } from './base';
import { User } from './user';
import { School } from './school';
import { Class } from './school';

// Forward declarations for circular dependencies
export interface Subject {
  id: number;
  class_id: number;
  school_id: number;
  subject_name: string;
  teacher_id?: number;
  created_at: string;
  updated_at: string;
}

export interface TeacherTimetable {
  id: number;
  teacher_id: number;
  class_id: number;
  subject_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  class_type: string;
  room_number?: string;
  created_at: string;
  updated_at: string;
}

export interface TeacherAttendance {
  id: number;
  teacher_id: number;
  date: string;
  status: string;
  leave_request_status?: string;
  leave_start_date?: string;
  leave_end_date?: string;
  created_at: string;
  updated_at: string;
}

// Teacher Profile Model
export interface TeacherProfile extends BaseModel {
  user_id: number;
  school_id: number;
  name: string;
  phone?: string;
  email?: string;
  blood_group?: string;
  address?: string;
  handling_classes?: string;
  home_class_id?: number;
  subjects_handled?: string;
  personal_attendance_percent?: number;
  leaves_count: number;
  salary_status?: string;
}

export interface TeacherProfileInsert extends BaseInsert {
  user_id: number;
  school_id: number;
  name: string;
  phone?: string;
  email?: string;
  blood_group?: string;
  address?: string;
  handling_classes?: string;
  home_class_id?: number;
  subjects_handled?: string;
  personal_attendance_percent?: number;
  leaves_count?: number;
  salary_status?: string;
}

export interface TeacherProfileUpdate extends BaseUpdate {
  user_id?: number;
  school_id?: number;
  name?: string;
  phone?: string;
  email?: string;
  blood_group?: string;
  address?: string;
  handling_classes?: string;
  home_class_id?: number;
  subjects_handled?: string;
  personal_attendance_percent?: number;
  leaves_count?: number;
  salary_status?: string;
}

// Teacher with related data
export interface TeacherWithDetails extends TeacherProfile {
  user: User;
  school: School;
  home_class?: Class;
  subjects: Subject[];
  handling_classes_list: Class[];
  timetable: TeacherTimetable[];
  attendance: TeacherAttendance[];
}

export interface TeacherWithStats extends TeacherProfile {
  total_students: number;
  total_subjects: number;
  attendance_percentage: number;
  average_marks_given: number;
  notes_uploaded: number;
}

// Teacher search and filter
export interface TeacherSearchParams {
  name?: string;
  subjects?: string[];
  blood_group?: string;
  salary_status?: string;
  home_class_id?: number;
}

// Teacher statistics
export interface TeacherStats {
  total_teachers: number;
  teachers_by_subject: Record<string, number>;
  average_attendance: number;
  teachers_on_leave: number;
  top_performers: TeacherWithStats[];
}

// Home Class and Handling Class relationships
export interface HomeClass extends BaseModel {
  teacher_id: number;
  class_id: number;
}

export interface HomeClassInsert extends BaseInsert {
  teacher_id: number;
  class_id: number;
}

export interface HandlingClass extends BaseModel {
  teacher_id: number;
  class_id: number;
}

export interface HandlingClassInsert extends BaseInsert {
  teacher_id: number;
  class_id: number;
}

// Re-export for convenience
export type { TeacherProfile };
