import { Schema, model, Types, Document } from "mongoose";

export interface ITeacherProfile extends Document {
  teacherId: string;
  schoolId: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  bloodGroup: string;
  handlingClassIds: string[]; // array of class ids
  homeClassId: string;
  handlingSubjects: string[]; // subject ids
  personalAttendancePercent: number;
  numberOfLeaves: number;
  salaryStatus: "credited" | "pending";
}

const TeacherProfileSchema = new Schema<ITeacherProfile>({
  teacherId: { type: String, required: true, unique: true },
  schoolId: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  bloodGroup: { type: String },
  handlingClassIds: [{ type: String }],
  homeClassId: { type: String },
  handlingSubjects: [{ type: String }],
  personalAttendancePercent: { type: Number, default: 0 },
  numberOfLeaves: { type: Number, default: 0 },
  salaryStatus: { type: String, enum: ["credited", "pending"], default: "pending" },
}, { timestamps: true });

export const TeacherProfile = model<ITeacherProfile>("TeacherProfile", TeacherProfileSchema);
