import { Schema, model, Document } from "mongoose";

export interface IHomeClass extends Document {
  classId: string;
  teacherId: string;
  studentIds: string[];
  studentNames: string[];
  classFeePaymentPercent: number;
}

const HomeClassSchema = new Schema<IHomeClass>({
  classId: { type: String, required: true },
  teacherId: { type: String, required: true },
  studentIds: [{ type: String }],
  studentNames: [{ type: String }],
  classFeePaymentPercent: { type: Number, default: 0 },
}, { timestamps: true });

export const HomeClass = model<IHomeClass>("HomeClass", HomeClassSchema);
