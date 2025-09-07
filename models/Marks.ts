import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMarks extends Document {
  student_id: string;
  class_id: mongoose.Types.ObjectId;
  subject_id: mongoose.Types.ObjectId;
  subject_name: string;
  marks_obtained: number;
  grade?: string;
  percentage?: number;
  cgpa?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const MarksSchema: Schema<IMarks> = new Schema(
  {
    student_id: { type: String, ref: "StudentProfile", required: true },
    class_id: { type: Schema.Types.ObjectId, ref: "ClassInfo", required: true },
    subject_id: { type: Schema.Types.ObjectId, ref: "SubjectInfo", required: true },
    subject_name: { type: String, required: true },
    marks_obtained: { type: Number, required: true },
    grade: { type: String },
    percentage: { type: Number },
    cgpa: { type: Number },
  },
  { timestamps: true }
);

export const Marks: Model<IMarks> = mongoose.model<IMarks>("Marks", MarksSchema);
