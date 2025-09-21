import { BaseModel, BaseInsert, BaseUpdate, TimeString, ClassType } from './base';
import { StudentProfile } from './student';
import { TeacherProfile } from './teacher';
import { Class } from './school';
import { Subject } from './subject';

// Student Timetable Model
export interface StudentTimetable extends BaseModel {
  student_id: number;
  class_id: number;
  subject_id: number;
  day_of_week: string;
  start_time: TimeString;
  end_time: TimeString;
  class_type: ClassType;
  teacher_id?: number;
}

export interface StudentTimetableInsert extends BaseInsert {
  student_id: number;
  class_id: number;
  subject_id: number;
  day_of_week: string;
  start_time: TimeString;
  end_time: TimeString;
  class_type: ClassType;
  teacher_id?: number;
}

export interface StudentTimetableUpdate extends BaseUpdate {
  student_id?: number;
  class_id?: number;
  subject_id?: number;
  day_of_week?: string;
  start_time?: TimeString;
  end_time?: TimeString;
  class_type?: ClassType;
  teacher_id?: number;
}

// Teacher Timetable Model
export interface TeacherTimetable extends BaseModel {
  teacher_id: number;
  class_id: number;
  subject_id: number;
  day_of_week: string;
  start_time: TimeString;
  end_time: TimeString;
  class_type: ClassType;
  room_number?: string;
}

export interface TeacherTimetableInsert extends BaseInsert {
  teacher_id: number;
  class_id: number;
  subject_id: number;
  day_of_week: string;
  start_time: TimeString;
  end_time: TimeString;
  class_type: ClassType;
  room_number?: string;
}

export interface TeacherTimetableUpdate extends BaseUpdate {
  teacher_id?: number;
  class_id?: number;
  subject_id?: number;
  day_of_week?: string;
  start_time?: TimeString;
  end_time?: TimeString;
  class_type?: ClassType;
  room_number?: string;
}

// Timetable with related data
export interface StudentTimetableWithDetails extends StudentTimetable {
  student: StudentProfile;
  class: Class;
  subject: Subject;
  teacher?: TeacherProfile;
}

export interface TeacherTimetableWithDetails extends TeacherTimetable {
  teacher: TeacherProfile;
  class: Class;
  subject: Subject;
}

// Weekly timetable view
export interface WeeklyTimetable {
  day: string;
  periods: TimetablePeriod[];
}

export interface TimetablePeriod {
  id: number;
  start_time: TimeString;
  end_time: TimeString;
  subject_name: string;
  teacher_name: string;
  class_type: ClassType;
  room_number?: string;
}

// Student weekly timetable
export interface StudentWeeklyTimetable {
  student_id: number;
  student_name: string;
  class_name: string;
  week: WeeklyTimetable[];
}

// Teacher weekly timetable
export interface TeacherWeeklyTimetable {
  teacher_id: number;
  teacher_name: string;
  week: WeeklyTimetable[];
}

// Timetable search and filter
export interface TimetableSearchParams {
  student_id?: number;
  teacher_id?: number;
  class_id?: number;
  subject_id?: number;
  day_of_week?: string;
  class_type?: ClassType;
}

// Timetable statistics
export interface TimetableStats {
  total_periods: number;
  periods_by_day: Record<string, number>;
  periods_by_type: Record<ClassType, number>;
  average_periods_per_day: number;
}

// Timetable conflicts
export interface TimetableConflict {
  type: 'teacher_conflict' | 'room_conflict' | 'student_conflict';
  conflicting_periods: TimetablePeriod[];
  message: string;
}

// Re-export for convenience
export type { StudentTimetable, TeacherTimetable };
