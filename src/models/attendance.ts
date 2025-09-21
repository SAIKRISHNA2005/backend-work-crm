import { BaseModel, BaseInsert, BaseUpdate, DateString, AttendanceStatus, LeaveRequestStatus } from './base';
import { StudentProfile } from './student';
import { TeacherProfile } from './teacher';
import { Class } from './school';

// Student Attendance Model
export interface StudentAttendance extends BaseModel {
  student_id: number;
  class_id: number;
  teacher_id?: number;
  date: DateString;
  status: AttendanceStatus;
  leave_request_status?: LeaveRequestStatus;
}

export interface StudentAttendanceInsert extends BaseInsert {
  student_id: number;
  class_id: number;
  teacher_id?: number;
  date: DateString;
  status: AttendanceStatus;
  leave_request_status?: LeaveRequestStatus;
}

export interface StudentAttendanceUpdate extends BaseUpdate {
  student_id?: number;
  class_id?: number;
  teacher_id?: number;
  date?: DateString;
  status?: AttendanceStatus;
  leave_request_status?: LeaveRequestStatus;
}

// Teacher Attendance Model
export interface TeacherAttendance extends BaseModel {
  teacher_id: number;
  date: DateString;
  status: AttendanceStatus;
  leave_request_status?: LeaveRequestStatus;
  leave_start_date?: DateString;
  leave_end_date?: DateString;
}

export interface TeacherAttendanceInsert extends BaseInsert {
  teacher_id: number;
  date: DateString;
  status: AttendanceStatus;
  leave_request_status?: LeaveRequestStatus;
  leave_start_date?: DateString;
  leave_end_date?: DateString;
}

export interface TeacherAttendanceUpdate extends BaseUpdate {
  teacher_id?: number;
  date?: DateString;
  status?: AttendanceStatus;
  leave_request_status?: LeaveRequestStatus;
  leave_start_date?: DateString;
  leave_end_date?: DateString;
}

// Attendance with related data
export interface StudentAttendanceWithDetails extends StudentAttendance {
  student: StudentProfile;
  class: Class;
  teacher?: TeacherProfile;
}

export interface TeacherAttendanceWithDetails extends TeacherAttendance {
  teacher: TeacherProfile;
}

// Attendance statistics
export interface AttendanceStats {
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  attendance_percentage: number;
  leave_requests: number;
  pending_leave_requests: number;
}

// Student attendance summary
export interface StudentAttendanceSummary {
  student_id: number;
  student_name: string;
  class_name: string;
  roll_number?: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  attendance_percentage: number;
  leave_requests: number;
  recent_attendance: StudentAttendance[];
}

// Class attendance summary
export interface ClassAttendanceSummary {
  class_id: number;
  class_name: string;
  date: DateString;
  total_students: number;
  present_students: number;
  absent_students: number;
  late_students: number;
  attendance_percentage: number;
  students: StudentAttendanceSummary[];
}

// Teacher attendance summary
export interface TeacherAttendanceSummary {
  teacher_id: number;
  teacher_name: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  attendance_percentage: number;
  leave_requests: number;
  recent_attendance: TeacherAttendance[];
}

// Attendance search and filter
export interface AttendanceSearchParams {
  student_id?: number;
  teacher_id?: number;
  class_id?: number;
  date?: DateString;
  start_date?: DateString;
  end_date?: DateString;
  status?: AttendanceStatus;
  leave_request_status?: LeaveRequestStatus;
}

// Leave request
export interface LeaveRequest {
  id: number;
  user_id: number;
  user_type: 'student' | 'teacher';
  start_date: DateString;
  end_date: DateString;
  reason: string;
  status: LeaveRequestStatus;
  approved_by?: number;
  approved_at?: DateString;
  created_at: DateString;
  updated_at: DateString;
}

export interface LeaveRequestInsert {
  user_id: number;
  user_type: 'student' | 'teacher';
  start_date: DateString;
  end_date: DateString;
  reason: string;
  status?: LeaveRequestStatus;
  approved_by?: number;
  approved_at?: DateString;
}

// Attendance report
export interface AttendanceReport {
  period: {
    start_date: DateString;
    end_date: DateString;
  };
  summary: {
    total_days: number;
    average_attendance: number;
    students_above_75: number;
    students_below_75: number;
  };
  class_wise_attendance: ClassAttendanceSummary[];
  student_wise_attendance: StudentAttendanceSummary[];
}

// Re-export for convenience
export type { StudentAttendance, TeacherAttendance };
