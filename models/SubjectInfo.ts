import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubjectInfo extends Document {
  subject_id: string;
  subject_name: string;
  class_id: mongoose.Types.ObjectId;
  school_id: mongoose.Types.ObjectId;
  teacher_id: mongoose.Types.ObjectId;
  teacher_name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SubjectInfoSchema: Schema<ISubjectInfo> = new Schema(
  {
    subject_id: { type: String, required: true, unique: true },
    subject_name: { type: String, required: true },
    class_id: { type: Schema.Types.ObjectId, ref: "ClassInfo", required: true },
    school_id: { type: Schema.Types.ObjectId, ref: "School", required: true },
    teacher_id: { type: Schema.Types.ObjectId, ref: "TeacherProfile", required: true },
    teacher_name: { type: String, required: true },
  },
  { timestamps: true }
);

const SubjectInfo: Model<ISubjectInfo> = mongoose.model<ISubjectInfo>(
  "SubjectInfo",
  SubjectInfoSchema
);

export default SubjectInfo;
