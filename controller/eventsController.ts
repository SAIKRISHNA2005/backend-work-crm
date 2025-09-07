import { Request, Response } from "express";
import { Events } from "../models/EventsSchema";

const formatDate = (d?: Date) => {
  if (!d) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(d));
  } catch {
    return "";
  }
};

export const listEvents = async (_req: Request, res: Response) => {
  try {
    const upcomingDocs = await Events.find({ status: "Upcoming" }).sort({ startDate: 1 }).lean();
    const pastDocs = await Events.find({ status: "Past" }).sort({ startDate: -1 }).lean();

    const upcoming = upcomingDocs.map((e) => ({
      id: e._id,
      title: e.title,
      date: formatDate(e.startDate),
      time: [e.startTime, e.endTime].filter(Boolean).join(" - ") || undefined,
      location: e.location,
      type: e.category, // UI uses 'type'
      description: e.description,
      status: "upcoming",
      rsvp: Boolean(e.actions?.rsvpRequired),
    }));

    const past = pastDocs.map((e) => ({
      id: e._id,
      title: e.title,
      date: formatDate(e.startDate),
      time: [e.startTime, e.endTime].filter(Boolean).join(" - "),
      location: e.location,
      type: e.category,
      description: e.description,
      status: "past",
      attended: Boolean(e.actions?.attended),
    }));

    res.json({ upcoming, past });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const evt = await Events.create(req.body);
    res.status(201).json(evt);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid event payload" });
  }
};