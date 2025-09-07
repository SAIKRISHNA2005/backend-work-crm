import { Schema, model, Document, Types } from "mongoose";

export interface IStudentNotes extends Document {
  studentId: Types.ObjectId | string;    // Reference to Student
  noteId: Types.ObjectId | string;       // Reference to TeacherNotes
  subjectId: Types.ObjectId | string;
  subjectName: string;
  title: string;
  description: string;
  fileUrl?: string;
  fileType?: string;
  uploadedAt: Date;
  teacherId: Types.ObjectId | string;
  isImportant?: boolean;
  lastSeenAt?: Date;
  addedToDashboardAt?: Date;
  visibilityLevel: "class" | "section" | "all";
  availableFrom?: Date;
  availableUntil?: Date;
  tags?: string[];
}

const StudentNotesSchema = new Schema<IStudentNotes>({
  studentId:          { type: Schema.Types.ObjectId, ref: "Student", required: true },
  noteId:             { type: Schema.Types.ObjectId, ref: "TeacherNotes", required: true },
  subjectId:          { type: Schema.Types.ObjectId, ref: "SubjectInfo" },
  subjectName:        { type: String, required: true },
  title:              { type: String, required: true },
  description:        { type: String },
  fileUrl:            { type: String },
  fileType:           { type: String },
  uploadedAt:         { type: Date, required: true },
  teacherId:          { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  isImportant:        { type: Boolean, default: false },
  lastSeenAt:         { type: Date },
  addedToDashboardAt: { type: Date, default: Date.now },
  visibilityLevel:    { type: String, enum: ["class", "section", "all"], default: "class" },
  availableFrom:      { type: Date },
  availableUntil:     { type: Date },
  tags:               [{ type: String }],
}, { timestamps: true });

export const StudentNotes = model<IStudentNotes>("StudentNotes", StudentNotesSchema);
