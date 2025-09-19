import { Request, Response } from "express";
import { supabase } from "../config/database";

export class ExamSubjectsController {
  static async list(req: Request, res: Response) {
    const exam_id = req.query.exam_id ? Number(req.query.exam_id) : undefined;
    let query = supabase.from("exam_subjects").select("*");
    if (exam_id) query = query.eq("exam_id", exam_id);
    const { data, error } = await query.order("exam_date", { ascending: true });
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data });
  }

  static async create(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.exam_id || !b.subject_id || !b.exam_date) {
      return res.status(400).json({ success: false, message: "exam_id, subject_id, exam_date are required" });
    }
    const { data, error } = await supabase.from("exam_subjects").insert({
      exam_id: Number(b.exam_id),
      subject_id: Number(b.subject_id),
      exam_date: String(b.exam_date),
      start_time: b.start_time ?? null,
      end_time: b.end_time ?? null,
    }).select().single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.status(201).json({ success: true, message: "Created", data });
  }

  static async patch(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.id) return res.status(400).json({ success: false, message: "id is required" });
    const id = Number(b.id);
    const input: any = {};
    ["exam_id","subject_id","exam_date","start_time","end_time"].forEach((k) => {
      if (b[k] !== undefined) input[k] = b[k];
    });
    const { data, error } = await supabase.from("exam_subjects").update(input).eq("id", id).select().single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Updated", data });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const { error } = await supabase.from("exam_subjects").delete().eq("id", id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  }
}