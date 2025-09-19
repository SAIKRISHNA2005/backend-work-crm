import { Request, Response } from "express";
import { supabase } from "../config/database";

export class AcademicCalendarController {
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const class_id = req.query.class_id ? Number(req.query.class_id) : undefined;
    const school_id = req.query.school_id ? Number(req.query.school_id) : undefined;
    const month = req.query.month ? Number(req.query.month) : undefined;
    const event_type = req.query.event_type ? String(req.query.event_type) : undefined;

    let query = supabase.from("academic_calendar").select("*", { count: "exact" });
    if (class_id) query = query.eq("class_id", class_id);
    if (school_id) query = query.eq("school_id", school_id);
    if (month) query = query.eq("month", month);
    if (event_type) query = query.eq("event_type", event_type);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.order("start_date", { ascending: true }).range(from, to);

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data, pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0)/limit) } });
  }

  static async create(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.title || !b.start_date) {
      return res.status(400).json({ success: false, message: "title, start_date are required" });
    }
    const { data, error } = await supabase.from("academic_calendar").insert({
      class_id: b.class_id ?? null,
      school_id: b.school_id ?? null,
      month: b.month ?? null,
      event_type: b.event_type ?? null,
      title: String(b.title),
      description: b.description ?? null,
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
    ["class_id","school_id","month","event_type","title","description","start_date","end_date"].forEach((k) => {
      if (b[k] !== undefined) input[k] = b[k];
    });
    const { data, error } = await supabase.from("academic_calendar").update(input).eq("id", id).select().single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Updated", data });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const { error } = await supabase.from("academic_calendar").delete().eq("id", id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  }
}