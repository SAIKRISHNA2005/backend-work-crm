import { BaseModel, BaseInsert, BaseUpdate } from './base';

// School Model
export interface School extends BaseModel {
  name: string;
  address?: string;
  location?: string;
  contact_info?: string;
}

export interface SchoolInsert extends BaseInsert {
  name: string;
  address?: string;
  location?: string;
  contact_info?: string;
}

export interface SchoolUpdate extends BaseUpdate {
  name?: string;
  address?: string;
  location?: string;
  contact_info?: string;
}

// School with related data
export interface SchoolWithClasses extends School {
  classes: Class[];
}

export interface SchoolWithStats extends School {
  total_students: number;
  total_teachers: number;
  total_classes: number;
}

// Class Model
export interface Class extends BaseModel {
  school_id: number;
  name: string;
  section?: string;
  room_number?: string;
  home_teacher_id?: number;
}

export interface ClassInsert extends BaseInsert {
  school_id: number;
  name: string;
  section?: string;
  room_number?: string;
  home_teacher_id?: number;
}

export interface ClassUpdate extends BaseUpdate {
  school_id?: number;
  name?: string;
  section?: string;
  room_number?: string;
  home_teacher_id?: number;
}

// Class with related data
export interface ClassWithDetails extends Class {
  school: School;
  home_teacher?: TeacherProfile;
  students: StudentProfile[];
  subjects: Subject[];
}

export interface ClassWithStats extends Class {
  student_count: number;
  subject_count: number;
  average_attendance: number;
}

// Re-export for convenience
export type { Class };
