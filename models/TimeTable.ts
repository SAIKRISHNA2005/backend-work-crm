import mongoose, { Schema, Document, Model } from "mongoose";

type ClassType = "theory" | "lab" | "break" | "lunch" | "physical_activity";

interface ISchedule {
  time: string;
  subject_name: string;
  teacher_name: string;
  class_type: ClassType;
  break_timings?: string;
}

export interface ITimetable extends Document {
  student_id?: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  school_id: mongoose.Types.ObjectId;
  schedule: ISchedule[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ScheduleSchema: Schema<ISchedule> = new Schema(
  {
    time: { type: String, required: true },
    subject_name: { type: String, required: true },
    teacher_name: { type: String, required: true },
    class_type: {
      type: String,
      enum: ["theory", "lab", "break", "lunch", "physical_activity"],
      required: true,
    },
    break_timings: { type: String },
  },
  { _id: false } // prevent automatic _id for each schedule entry
);

const TimetableSchema: Schema<ITimetable> = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "StudentProfile" },
    class_id: { type: Schema.Types.ObjectId, ref: "ClassInfo", required: true },
    school_id: { type: Schema.Types.ObjectId, ref: "School", required: true },
    schedule: [ScheduleSchema],
  },
  { timestamps: true }
);

const Timetable: Model<ITimetable> = mongoose.model<ITimetable>("Timetable", TimetableSchema);

export default Timetable;
