import { Request, Response } from "express";
import { supabase } from "../config/database";

export class ExamsController {
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const class_id = req.query.class_id ? Number(req.query.class_id) : undefined;
    const school_id = req.query.school_id ? Number(req.query.school_id) : undefined;

    let query = supabase.from("exams").select("*", { count: "exact" });
    if (class_id) query = query.eq("class_id", class_id);
    if (school_id) query = query.eq("school_id", school_id);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.order("start_date", { ascending: false }).range(from, to);

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data, pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0)/limit) } });
  }

  static async create(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.class_id || !b.school_id || !b.exam_name || !b.start_date) {
      return res.status(400).json({ success: false, message: "class_id, school_id, exam_name, start_date are required" });
    }
    const { data, error } = await supabase.from("exams").insert({
      class_id: Number(b.class_id),
      school_id: Number(b.school_id),
      exam_name: String(b.exam_name),
      start_date: String(b.start_date),
      end_date: b.end_date ?? null,
    }).select().single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.status(201).json({ success: true, message: "Created", data });
  }

  static async patch(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.id) return res.status(400).json({ success: false, message: "id is required" });
    const id = Number(b.id);
    const input: any = {};
    ["class_id","school_id","exam_name","start_date","end_date"].forEach((k) => {
      if (b[k] !== undefined) input[k] = b[k];
    });
    const { data, error } = await supabase.from("exams").update(input).eq("id", id).select().single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Updated", data });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const { error } = await supabase.from("exams").delete().eq("id", id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  }
}