import { Schema, model, Document } from "mongoose";

export interface IClassAttendance extends Document {
  classId: string;
  teacherId: string;
  yearlyAttendancePercent: number;
  monthlyAttendancePercent: number;
  weeklyAttendancePercent: number;
  studentLeaveStatus: "accepted" | "rejected" | "pending";
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateArrivals: number;
}

export interface IPersonalAttendance extends Document {
  teacherId: string;
  teacherName: string;
  yearlyAttendancePercent: number;
  monthlyAttendancePercent: number;
  weeklyAttendancePercent: number;
  leaveRequestStatus: "accepted" | "rejected" | "pending";
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateArrivals: number;
  leaveDates: { startDate: Date; endDate: Date }[];
}

const ClassAttendanceSchema = new Schema<IClassAttendance>({
  classId: { type: String, required: true },
  teacherId: { type: String, required: true },
  yearlyAttendancePercent: { type: Number },
  monthlyAttendancePercent: { type: Number },
  weeklyAttendancePercent: { type: Number },
  studentLeaveStatus: { type: String, enum: ["accepted", "rejected", "pending"] },
  totalWorkingDays: { type: Number },
  presentDays: { type: Number },
  absentDays: { type: Number },
  lateArrivals: { type: Number },
}, { timestamps: true });

const PersonalAttendanceSchema = new Schema<IPersonalAttendance>({
  teacherId: { type: String, required: true },
  teacherName: { type: String, required: true },
  yearlyAttendancePercent: { type: Number },
  monthlyAttendancePercent: { type: Number },
  weeklyAttendancePercent: { type: Number },
  leaveRequestStatus: { type: String, enum: ["accepted", "rejected", "pending"] },
  totalWorkingDays: { type: Number },
  presentDays: { type: Number },
  absentDays: { type: Number },
  lateArrivals: { type: Number },
  leaveDates: [{
    startDate: { type: Date },
    endDate: { type: Date },
  }],
}, { timestamps: true });

export const ClassAttendance = model<IClassAttendance>("ClassAttendance", ClassAttendanceSchema);
export const PersonalAttendance = model<IPersonalAttendance>("PersonalAttendance", PersonalAttendanceSchema);
