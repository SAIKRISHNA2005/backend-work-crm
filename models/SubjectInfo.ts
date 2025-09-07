import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubjectInfo extends Document {
  subject_id: string;
  subject_name: string;
  class_id: mongoose.Types.ObjectId;
  teacher_id: mongoose.Types.ObjectId;
  teacher_name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SubjectInfoSchema: Schema<ISubjectInfo> = new Schema(
  {
    subject_id: { type: String, required: true, unique: true },
    subject_name: { type: String, required: true },
    class_id: { type: Schema.Types.ObjectId, ref: "ClassInfo" },
    teacher_id: { type: Schema.Types.ObjectId, ref: "TeacherProfile" },
    teacher_name: { type: String, required: true },
  },
  { timestamps: true }
);

export const SubjectInfo: Model<ISubjectInfo> = mongoose.model<ISubjectInfo>(
  "SubjectInfo",
  SubjectInfoSchema
);

