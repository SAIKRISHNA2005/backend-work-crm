import mongoose, { Schema, Document, Model } from "mongoose";

type LeaveStatus = "accepted" | "rejected" | "pending";

export interface IStudentAttendance extends Document {
  student_id: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  school_id: mongoose.Types.ObjectId;
  teacher_id?: mongoose.Types.ObjectId;
  student_name?: string;
  home_class_teacher_name?: string;
  yearly_attendance?: number;
  monthly_attendance?: number;
  weekly_attendance?: number;
  leave_request_status?: LeaveStatus;
  total_working_days?: number;
  present_days?: number;
  absent_days?: number;
  late_arrivals?: number;
}

const AttendanceSchema: Schema<IStudentAttendance> = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "StudentProfile", required: true },
    class_id: { type: Schema.Types.ObjectId, ref: "ClassInfo", required: true },
    school_id: { type: Schema.Types.ObjectId, ref: "School", required: true },
    teacher_id: { type: Schema.Types.ObjectId, ref: "TeacherProfile" },
    student_name: { type: String },
    home_class_teacher_name: { type: String },
    yearly_attendance: { type: Number },
    monthly_attendance: { type: Number },
    weekly_attendance: { type: Number },
    leave_request_status: { type: String, enum: ["accepted", "rejected", "pending"], default: "pending" },
    total_working_days: { type: Number },
    present_days: { type: Number },
    absent_days: { type: Number },
    late_arrivals: { type: Number },
  },
  { timestamps: true }
);

const StudentAttendance: Model<IStudentAttendance> = mongoose.model<IStudentAttendance>("StudentAttendance", AttendanceSchema);

export default StudentAttendance;
