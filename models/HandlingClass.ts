import { Schema, model, Document } from "mongoose";

export interface IHandlingClass extends Document {
  classId: string;
  teacherId: string;
  studentIds: string[];
  studentNames: string[];
}

const HandlingClassSchema = new Schema<IHandlingClass>({
  classId: { type: String, required: true },
  teacherId: { type: String, required: true },
  studentIds: [{ type: String }],
  studentNames: [{ type: String }],
}, { timestamps: true });

export const HandlingClass = model<IHandlingClass>("HandlingClass", HandlingClassSchema);
