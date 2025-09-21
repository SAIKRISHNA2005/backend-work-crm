import { BaseModel, BaseInsert, BaseUpdate } from './base';
import { StudentProfile } from './student';
import { ExamSubject } from './exam';

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

export interface Exam {
  id: number;
  class_id: number;
  school_id: number;
  exam_name: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

// Mark Model
export interface Mark extends BaseModel {
  student_id: number;
  exam_subject_id: number;
  marks_obtained: number;
  grade?: string;
}

export interface MarkInsert extends BaseInsert {
  student_id: number;
  exam_subject_id: number;
  marks_obtained: number;
  grade?: string;
}

export interface MarkUpdate extends BaseUpdate {
  student_id?: number;
  exam_subject_id?: number;
  marks_obtained?: number;
  grade?: string;
}

// Mark with related data
export interface MarkWithDetails extends Mark {
  student: StudentProfile;
  exam_subject: ExamSubjectWithDetails;
}

export interface ExamSubjectWithDetails extends ExamSubject {
  subject: Subject;
  exam: Exam;
}

// Mark statistics
export interface MarkStats {
  total_marks: number;
  average_marks: number;
  highest_marks: number;
  lowest_marks: number;
  grade_distribution: Record<string, number>;
}

// Student marks summary
export interface StudentMarksSummary {
  student_id: number;
  student_name: string;
  class_name: string;
  roll_number?: string;
  total_marks: number;
  average_marks: number;
  percentage: number;
  grade: string;
  rank: number;
  subject_marks: SubjectMark[];
}

export interface SubjectMark {
  subject_name: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  grade: string;
}

// Class marks summary
export interface ClassMarksSummary {
  class_id: number;
  class_name: string;
  total_students: number;
  average_marks: number;
  pass_percentage: number;
  top_students: StudentMarksSummary[];
  subject_wise_average: Record<string, number>;
}

// Mark search and filter
export interface MarkSearchParams {
  student_id?: number;
  exam_subject_id?: number;
  exam_id?: number;
  subject_id?: number;
  class_id?: number;
  min_marks?: number;
  max_marks?: number;
  grade?: string;
}

// Grade calculation
export interface GradeScale {
  A_PLUS: { min: number; max: number };
  A: { min: number; max: number };
  B_PLUS: { min: number; max: number };
  B: { min: number; max: number };
  C_PLUS: { min: number; max: number };
  C: { min: number; max: number };
  D: { min: number; max: number };
  F: { min: number; max: number };
}

// Re-export for convenience
export type { Mark };
