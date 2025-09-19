import { Request, Response } from "express";
import { supabase } from "../config/database";

export class DigitalNotesController {
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const class_id = req.query.class_id ? Number(req.query.class_id) : undefined;
    const subject_id = req.query.subject_id ? Number(req.query.subject_id) : undefined;
    const section_type = req.query.section_type ? String(req.query.section_type) : undefined;

    let query = supabase.from("digital_notes").select("*", { count: "exact" });
    if (class_id) query = query.eq("class_id", class_id);
    if (subject_id) query = query.eq("subject_id", subject_id);
    if (section_type) query = query.eq("section_type", section_type);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.order("uploaded_at", { ascending: false }).range(from, to);

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data, pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0)/limit) } });
  }

  static async create(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.class_id || !b.subject_id || !b.section_type || !b.title) {
      return res.status(400).json({ success: false, message: "class_id, subject_id, section_type, title are required" });
    }
    const { data, error } = await supabase.from("digital_notes").insert({
      class_id: Number(b.class_id),
      subject_id: Number(b.subject_id),
      section_type: String(b.section_type),
      title: String(b.title),
      description: b.description ?? null,
      resource_url: b.resource_url ?? null,
      file_type: b.file_type ?? null,
      due_date: b.due_date ?? null,
      is_important: !!b.is_important,
      added_by_id: b.added_by_id ?? null,
      last_seen_at: b.last_seen_at ?? null,
    }).select().single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.status(201).json({ success: true, message: "Created", data });
  }

  static async patch(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.id) return res.status(400).json({ success: false, message: "id is required" });
    const id = Number(b.id);
    const input: any = {};
    ["class_id","subject_id","section_type","title","description","resource_url","file_type","due_date","is_important","added_by_id","last_seen_at"].forEach((k) => {
      if (b[k] !== undefined) input[k] = b[k];
    });
    const { data, error } = await supabase.from("digital_notes").update(input).eq("id", id).select().single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Updated", data });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const { error } = await supabase.from("digital_notes").delete().eq("id", id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  }
}