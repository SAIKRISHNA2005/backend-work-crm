import { Request, Response } from "express";
import { supabase } from "../config/database";

export class AchievementsController {
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const student_id = req.query.student_id ? Number(req.query.student_id) : undefined;

    let query = supabase.from("achievements").select("*", { count: "exact" });
    if (student_id) query = query.eq("student_id", student_id);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.order("date", { ascending: false }).range(from, to);

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data, pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0)/limit) } });
  }

  static async create(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.student_id || !b.title) {
      return res.status(400).json({ success: false, message: "student_id, title are required" });
    }
    const { data, error } = await supabase.from("achievements").insert({
      student_id: Number(b.student_id),
      title: String(b.title),
      description: b.description ?? null,
      date: b.date ?? null,
      location: b.location ?? null,
      award_type: b.award_type ?? null,
    }).select().single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.status(201).json({ success: true, message: "Created", data });
  }

  static async patch(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.id) return res.status(400).json({ success: false, message: "id is required" });
    const id = Number(b.id);
    const input: any = {};
    ["student_id","title","description","date","location","award_type"].forEach((k) => {
      if (b[k] !== undefined) input[k] = b[k];
    });
    const { data, error } = await supabase.from("achievements").update(input).eq("id", id).select().single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Updated", data });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  }
}