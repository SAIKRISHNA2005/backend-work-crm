import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeacherProfile extends Document {
  teacherId: string;
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

export const TeacherProfile: Model<ITeacherProfile> = mongoose.model<ITeacherProfile>("TeacherProfile", TeacherProfileSchema);
