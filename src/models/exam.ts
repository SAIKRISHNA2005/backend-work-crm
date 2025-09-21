import { BaseModel, BaseInsert, BaseUpdate, DateString, TimeString } from './base';
import { Class } from './school';
import { Subject } from './subject';

// Exam Model
export interface Exam extends BaseModel {
  class_id: number;
  school_id: number;
  exam_name: string;
  start_date?: DateString;
  end_date?: DateString;
}

export interface ExamInsert extends BaseInsert {
  class_id: number;
  school_id: number;
  exam_name: string;
  start_date?: DateString;
  end_date?: DateString;
}

export interface ExamUpdate extends BaseUpdate {
  class_id?: number;
  school_id?: number;
  exam_name?: string;
  start_date?: DateString;
  end_date?: DateString;
}

// Exam Subject Model
export interface ExamSubject extends BaseModel {
  exam_id: number;
  subject_id: number;
  exam_date?: DateString;
  start_time?: TimeString;
  end_time?: TimeString;
}

export interface ExamSubjectInsert extends BaseInsert {
  exam_id: number;
  subject_id: number;
  exam_date?: DateString;
  start_time?: TimeString;
  end_time?: TimeString;
}

export interface ExamSubjectUpdate extends BaseUpdate {
  exam_id?: number;
  subject_id?: number;
  exam_date?: DateString;
  start_time?: TimeString;
  end_time?: TimeString;
}

// Exam with related data
export interface ExamWithDetails extends Exam {
  class: Class;
  exam_subjects: ExamSubjectWithDetails[];
  total_students: number;
  total_subjects: number;
}

export interface ExamSubjectWithDetails extends ExamSubject {
  subject: Subject;
  marks: Mark[];
  total_students: number;
  average_marks: number;
}

// Exam search and filter
export interface ExamSearchParams {
  exam_name?: string;
  class_id?: number;
  school_id?: number;
  start_date?: DateString;
  end_date?: DateString;
}

// Exam statistics
export interface ExamStats {
  total_exams: number;
  upcoming_exams: number;
  completed_exams: number;
  average_marks: number;
  top_performers: ExamPerformance[];
}

export interface ExamPerformance {
  student_id: number;
  student_name: string;
  class_name: string;
  total_marks: number;
  percentage: number;
  rank: number;
}

// Exam schedule
export interface ExamSchedule {
  exam_id: number;
  exam_name: string;
  class_name: string;
  subjects: {
    subject_name: string;
    exam_date: DateString;
    start_time: TimeString;
    end_time: TimeString;
  }[];
}

// Re-export for convenience
export type { Exam, ExamSubject };
