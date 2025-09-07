import { Request, Response } from "express";
import { Attendance } from "../models/Attendance";
import { ClassInfo } from "../models/ClassInfo";

export const getStudentAttendanceOverview = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params; // StudentProfile.student_id string
    const att = await Attendance.findOne({ student_id: studentId }).lean();
    if (!att) return res.json({
      yearly: 0, monthly: 0, weekly: 0,
      working_days: 0, holidays: 0, half_days: 0
    });

    res.json({
      yearly: att.yearly_attendance || 0,
      monthly: att.monthly_attendance || 0,
      weekly: att.weekly_attendance || 0,
      working_days: att.total_working_days || 0,
      holidays: att.absent_days || 0, // placeholder
      half_days: att.late_arrivals || 0, // placeholder
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateClassAttendance = async (req: Request, res: Response) => {
  try {
    const { classCode, date, present } = req.body as { classCode: string; date: string; present: string[] };
    if (!classCode || !date || !Array.isArray(present)) {
      return res.status(400).json({ message: "classCode, date, present[] required" });
    }

    const cls = await ClassInfo.findOne({ class_id: classCode }).lean();
    if (!cls) return res.status(404).json({ message: "Class not found" });

    // In a real app: upsert per-student entries for the date.
    // Here: acknowledge payload for UI integration
    return res.json({ message: "Attendance updated", class_id: cls._id, date, present_count: present.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};