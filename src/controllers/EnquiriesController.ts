import { Request, Response } from "express";
import { supabase } from "../config/database";

export class EnquiriesController {
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const user_id = req.query.user_id ? Number(req.query.user_id) : undefined;
    const status = req.query.status ? String(req.query.status) : undefined;

    let query = supabase.from("enquiries").select("*", { count: "exact" });
    if (user_id) query = query.eq("user_id", user_id);
    if (status) query = query.eq("status", status);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.order("last_update", { ascending: false }).range(from, to);

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data, pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0)/limit) } });
  }

  static async create(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.user_id || !b.subject) {
      return res.status(400).json({ success: false, message: "user_id, subject are required" });
    }
    const { data, error } = await supabase.from("enquiries").insert({
      user_id: Number(b.user_id),
      subject: String(b.subject),
      category: b.category ?? null,
      description: b.description ?? null,
      status: b.status ?? 'active',
      date: b.date ?? null,
      priority: b.priority ?? null,
      last_update: b.last_update ?? null,
      actions_taken: b.actions_taken ?? null,
      attachment_url: b.attachment_url ?? null,
    }).select().single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.status(201).json({ success: true, message: "Created", data });
  }

  static async patch(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.id) return res.status(400).json({ success: false, message: "id is required" });
    const id = Number(b.id);
    const input: any = {};
    ["user_id","subject","category","description","status","date","priority","last_update","actions_taken","attachment_url"].forEach((k) => {
      if (b[k] !== undefined) input[k] = b[k];
    });
    const { data, error } = await supabase.from("enquiries").update(input).eq("id", id).select().single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Updated", data });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  }
}