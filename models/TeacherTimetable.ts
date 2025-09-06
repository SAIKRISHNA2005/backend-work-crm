import { Schema, model, Document } from "mongoose";

export interface ITeacherTimetable extends Document {
  classId: string;
  classRoomNumber: string;
  classTimings: string;
  subjectName: string;
  classType: "theory" | "lab" | "break" | "lunch";
}

const TeacherTimetableSchema = new Schema<ITeacherTimetable>({
  classId: { type: String, required: true },
  classRoomNumber: { type: String },
  classTimings: { type: String, required: true },
  subjectName: { type: String, required: true },
  classType: { type: String, enum: ["theory", "lab", "break", "lunch"], required: true },
}, { timestamps: true });

export const TeacherTimetable = model<ITeacherTimetable>("TeacherTimetable", TeacherTimetableSchema);
