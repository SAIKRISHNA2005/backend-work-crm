import { BaseModel, BaseInsert, BaseUpdate } from './base';
import { Class } from './school';
import { TeacherProfile } from './teacher';

// Forward declarations for circular dependencies
export interface StudentTimetable {
  id: number;
  student_id: number;
  class_id: number;
  subject_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  class_type: string;
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

export interface Mark {
  id: number;
  student_id: number;
  exam_subject_id: number;
  marks_obtained: number;
  grade?: string;
  created_at: string;
  updated_at: string;
}

export interface DigitalNote {
  id: number;
  class_id: number;
  subject_id: number;
  section_type: string;
  title?: string;
  description?: string;
  resource_url?: string;
  file_type?: string;
  uploaded_at: string;
  due_date?: string;
  is_important: boolean;
  added_by_id?: number;
  last_seen_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TeacherNote {
  id: number;
  teacher_id: number;
  class_id: number;
  subject_id?: number;
  title?: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  uploaded_at: string;
  is_published: boolean;
  visibility?: string;
  available_from?: string;
  available_until?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

// Subject Model
export interface Subject extends BaseModel {
  class_id: number;
  school_id: number;
  subject_name: string;
  teacher_id?: number;
}

export interface SubjectInsert extends BaseInsert {
  class_id: number;
  school_id: number;
  subject_name: string;
  teacher_id?: number;
}

export interface SubjectUpdate extends BaseUpdate {
  class_id?: number;
  school_id?: number;
  subject_name?: string;
  teacher_id?: number;
}

// Subject with related data
export interface SubjectWithDetails extends Subject {
  class: Class;
  teacher?: TeacherProfile;
  timetable: StudentTimetable[];
  teacher_timetable: TeacherTimetable[];
  marks: Mark[];
  digital_notes: DigitalNote[];
  teacher_notes: TeacherNote[];
}

export interface SubjectWithStats extends Subject {
  student_count: number;
  average_marks: number;
  notes_count: number;
  assignments_count: number;
}

// Subject search and filter
export interface SubjectSearchParams {
  subject_name?: string;
  class_id?: number;
  school_id?: number;
  teacher_id?: number;
}

// Subject statistics
export interface SubjectStats {
  total_subjects: number;
  subjects_by_class: Record<string, number>;
  subjects_by_teacher: Record<string, number>;
  average_marks_by_subject: Record<string, number>;
}

// Re-export for convenience
export type { Subject };
