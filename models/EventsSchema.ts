import { Schema, model, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  category: "Cultural" | "Academic" | "Educational" | "Sports" | "Other";
  description: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  status: "Upcoming" | "Past";
  actions: {
    rsvpRequired?: boolean;
    remindAvailable?: boolean;
    registerAvailable?: boolean;
    attended?: boolean;
  };
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ["Cultural", "Academic", "Educational", "Sports", "Other"], default: "Other" },
    description: { type: String },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    status: { type: String, enum: ["Upcoming", "Past"], default: "Upcoming" },
    actions: {
      rsvpRequired: { type: Boolean, default: false },
      remindAvailable: { type: Boolean, default: false },
      registerAvailable: { type: Boolean, default: false },
      attended: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const Events = model<IEvent>("Events", EventSchema);
