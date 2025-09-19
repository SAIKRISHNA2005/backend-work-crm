import { Request, Response } from "express";
import { supabase } from "../config/database";

export class TimetableController {
  static async student(req: Request, res: Response) {
    const student_id = req.query.student_id ? Number(req.query.student_id) : undefined;
    const class_id = req.query.class_id ? Number(req.query.class_id) : undefined;
    const day_of_week = req.query.day_of_week ? String(req.query.day_of_week) : undefined;
    let query = supabase.from("student_timetable").select("*");
    if (student_id) query = query.eq("student_id", student_id);
    if (class_id) query = query.eq("class_id", class_id);
    if (day_of_week) query = query.eq("day_of_week", day_of_week);
    const { data, error } = await query.order("start_time", { ascending: true });
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data });
  }

  static async teacher(req: Request, res: Response) {
    const teacher_id = req.query.teacher_id ? Number(req.query.teacher_id) : undefined;
    const day_of_week = req.query.day_of_week ? String(req.query.day_of_week) : undefined;
    let query = supabase.from("teacher_timetable").select("*");
    if (teacher_id) query = query.eq("teacher_id", teacher_id);
    if (day_of_week) query = query.eq("day_of_week", day_of_week);
    const { data, error } = await query.order("start_time", { ascending: true });
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data });
  }
}