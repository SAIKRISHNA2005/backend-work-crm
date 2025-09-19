import { Request, Response } from "express";
import { supabase } from "../config/database";

export class TeacherNotesController {
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const teacher_id = req.query.teacher_id ? Number(req.query.teacher_id) : undefined;
    const class_id = req.query.class_id ? Number(req.query.class_id) : undefined;

    let query = supabase.from("teacher_notes").select("*", { count: "exact" });
    if (teacher_id) query = query.eq("teacher_id", teacher_id);
    if (class_id) query = query.eq("class_id", class_id);
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.order("uploaded_at", { ascending: false }).range(from, to);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data, pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0)/limit) } });
  }

  static async create(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.teacher_id || !b.class_id || !b.subject_id || !b.title) {
      return res.status(400).json({ success: false, message: "teacher_id, class_id, subject_id, title are required" });
    }
    const { data, error } = await supabase.from("teacher_notes").insert({
      teacher_id: Number(b.teacher_id),
      class_id: Number(b.class_id),
      subject_id: Number(b.subject_id),
      title: String(b.title),
      description: b.description ?? null,
      file_url: b.file_url ?? null,
      file_type: b.file_type ?? null,
      is_published: b.is_published ?? false,
      visibility: b.visibility ?? 'class',
      available_from: b.available_from ?? null,
      available_until: b.available_until ?? null,
      tags: b.tags ?? null,
    }).select().single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.status(201).json({ success: true, message: "Created", data });
  }

  static async patch(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.id) return res.status(400).json({ success: false, message: "id is required" });
    const id = Number(b.id);
    const input: any = {};
    ["title","description","file_url","file_type","is_published","visibility","available_from","available_until","tags"].forEach((k) => {
      if (b[k] !== undefined) input[k] = b[k];
    });
    const { data, error } = await supabase.from("teacher_notes").update(input).eq("id", id).select().single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Updated", data });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const { error } = await supabase.from("teacher_notes").delete().eq("id", id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  }
}