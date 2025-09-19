import { Request, Response } from "express";
import { AttendanceService } from "../services/AttendanceService";

export class AttendanceController {
  static async upsert(req: Request, res: Response) {
    const { student_id, class_id, date, status } = req.body || {};
    if (!student_id || !class_id || !date || !status) {
      return res.status(400).json({ success: false, message: "student_id, class_id, date, status are required" });
    }
    const row = await AttendanceService.upsert({
      student_id: Number(student_id),
      class_id: Number(class_id),
      date: String(date),
      status,
    });
    res.status(200).json({ success: true, message: "OK", data: row });
  }
}