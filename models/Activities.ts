import mongoose, { Schema, Document, Model } from "mongoose";

type ActivityType = "achievement" | "event" | "reminder" | "announcement";
type ActivityStatus = "upcoming" | "current" | "past";

interface IActivity extends Document {
  student_id?: mongoose.Types.ObjectId;
  class_id?: mongoose.Types.ObjectId;
  school_id?: mongoose.Types.ObjectId;
  type: ActivityType;
  name?: string;
  description?: string;
  status?: ActivityStatus;
  date?: Date;
  timings?: string;
  venue?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ActivitiesSchema: Schema<IActivity> = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "StudentProfile" },
    class_id: { type: Schema.Types.ObjectId, ref: "ClassInfo" },
    school_id: { type: Schema.Types.ObjectId, ref: "School" },

    type: {
      type: String,
      enum: ["achievement", "event", "reminder", "announcement"],
      required: true,
    },
    name: { type: String },
    description: { type: String },
    status: { type: String, enum: ["upcoming", "current", "past"] },
    date: { type: Date },
    timings: { type: String },
    venue: { type: String },
  },
  { timestamps: true }
);

export const Activities: Model<IActivity> = mongoose.model<IActivity>(
  "Activities",
  ActivitiesSchema
);
