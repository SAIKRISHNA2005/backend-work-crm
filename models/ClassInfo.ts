import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClassInfo extends Document {
  class_id: string;
  student_id?: mongoose.Types.ObjectId[];
  classroom_number?: string;
  home_class_teacher_name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ClassInfoSchema: Schema<IClassInfo> = new Schema(
  {
    class_id: { type: String, required: true },
    student_id: [{ type: Schema.Types.ObjectId, ref: "StudentProfile" }],
    classroom_number: { type: String },
    home_class_teacher_name: { type: String },
  },
  { timestamps: true }
);

export const ClassInfo: Model<IClassInfo> = mongoose.model<IClassInfo>(
  "ClassInfo",
  ClassInfoSchema
);

