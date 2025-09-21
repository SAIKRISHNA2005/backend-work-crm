import { BaseModel, BaseInsert, BaseUpdate, DateString } from './base';
import { User } from './user';
import { School } from './school';
import { Class } from './school';

// Forward declarations for circular dependencies
export interface StudentAttendance {
  id: number;
  student_id: number;
  class_id: number;
  teacher_id?: number;
  date: string;
  status: string;
  leave_request_status?: string;
  created_at: string;
  updated_at: string;
}

export interface Mark {
  id: number;
  student_id: number;
  exam_subject_id: number;
  marks_obtained: number;
  grade?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentEventRegistration {
  id: number;
  student_id: number;
  event_id: number;
  registration_status: string;
  created_at: string;
  updated_at: string;
}

// Student Profile Model
export interface StudentProfile extends BaseModel {
  user_id: number;
  school_id: number;
  class_id: number;
  roll_number?: string;
  name: string;
  father_name?: string;
  mother_name?: string;
  father_occupation?: string;
  mother_occupation?: string;
  blood_group?: string;
  father_contact?: string;
  mother_contact?: string;
  aadhar_number?: string;
  bio?: string;
  superpowers?: string;
  current_mission?: string;
  side_quests?: string;
  joined_on?: DateString;
  address?: string;
  location?: string;
  fee_payment_status?: string;
  event_registration_info?: string;
  classwise_leaderboard_rank?: number;
  overall_leaderboard_rank?: number;
  active_courses?: string;
}

export interface StudentProfileInsert extends BaseInsert {
  user_id: number;
  school_id: number;
  class_id: number;
  roll_number?: string;
  name: string;
  father_name?: string;
  mother_name?: string;
  father_occupation?: string;
  mother_occupation?: string;
  blood_group?: string;
  father_contact?: string;
  mother_contact?: string;
  aadhar_number?: string;
  bio?: string;
  superpowers?: string;
  current_mission?: string;
  side_quests?: string;
  joined_on?: DateString;
  address?: string;
  location?: string;
  fee_payment_status?: string;
  event_registration_info?: string;
  classwise_leaderboard_rank?: number;
  overall_leaderboard_rank?: number;
  active_courses?: string;
}

export interface StudentProfileUpdate extends BaseUpdate {
  user_id?: number;
  school_id?: number;
  class_id?: number;
  roll_number?: string;
  name?: string;
  father_name?: string;
  mother_name?: string;
  father_occupation?: string;
  mother_occupation?: string;
  blood_group?: string;
  father_contact?: string;
  mother_contact?: string;
  aadhar_number?: string;
  bio?: string;
  superpowers?: string;
  current_mission?: string;
  side_quests?: string;
  joined_on?: DateString;
  address?: string;
  location?: string;
  fee_payment_status?: string;
  event_registration_info?: string;
  classwise_leaderboard_rank?: number;
  overall_leaderboard_rank?: number;
  active_courses?: string;
}

// Student with related data
export interface StudentWithDetails extends StudentProfile {
  user: User;
  school: School;
  class: Class;
  attendance?: StudentAttendance[];
  marks?: Mark[];
  events?: StudentEventRegistration[];
}

export interface StudentWithStats extends StudentProfile {
  attendance_percentage: number;
  total_marks: number;
  average_marks: number;
  events_registered: number;
  achievements_count: number;
}

// Student leaderboard
export interface StudentLeaderboard {
  student_id: number;
  student_name: string;
  class_name: string;
  roll_number?: string;
  xp: number;
  percentage: number;
  classwise_rank: number;
  overall_rank: number;
}

// Student search and filter
export interface StudentSearchParams {
  name?: string;
  roll_number?: string;
  class_id?: number;
  school_id?: number;
  blood_group?: string;
  fee_status?: string;
}

// Student statistics
export interface StudentStats {
  total_students: number;
  students_by_class: Record<string, number>;
  students_by_blood_group: Record<string, number>;
  average_attendance: number;
  top_performers: StudentLeaderboard[];
}

// Re-export for convenience
export type { StudentProfile };
