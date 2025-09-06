import { Schema, model, Document } from "mongoose";

export interface ITeacherNotes extends Document {
  teacherId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  fileUrl?: string;
  fileType?: string;
  uploadedAt: Date;
  isPublished: boolean;
  visibilityLevel: "class" | "section" | "all";
  availableFrom?: Date;
  availableUntil?: Date;
  tags?: string[];
}

const TeacherNotesSchema = new Schema<ITeacherNotes>({
  teacherId: { type: String, required: true },
  classId: { type: String, required: true },
  sectionId: { type: String },
  subjectId: { type: String },
  subjectName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  fileType: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
  visibilityLevel: { type: String, enum: ["class", "section", "all"], default: "class" },
  availableFrom: { type: Date },
  availableUntil: { type: Date },
  tags: [{ type: String }],
}, { timestamps: true });

export const TeacherNotes = model<ITeacherNotes>("TeacherNotes", TeacherNotesSchema);
