import { Schema, model, Document } from "mongoose";

export interface IClassAssignment extends Document {
  classId: string;
  teacherId: string;
  studentIds: string[];
  studentNames: string[];
  type: "home" | "handling"; // 👈 distinguishes between HomeClass & HandlingClass
  classFeePaymentPercent?: number; // only relevant for home class
}

const ClassAssignmentSchema = new Schema<IClassAssignment>(
  {
    classId: { type: String, required: true },
    teacherId: { type: String, required: true },
    studentIds: [{ type: String }],
    studentNames: [{ type: String }],
    type: { type: String, enum: ["home", "handling"], required: true },
    classFeePaymentPercent: { type: Number, default: 0 }, // for home classes
  },
  { timestamps: true }
);

export const ClassAssignment = model<IClassAssignment>(
  "ClassAssignment",
  ClassAssignmentSchema
);
