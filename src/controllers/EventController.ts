import { Request, Response } from "express";
import { supabase } from "../config/database";

export class EventController {
  static async list(req: Request, res: Response) {
    const school_id = req.query.school_id ? Number(req.query.school_id) : undefined;
    let query = supabase.from("events").select("id,title,description,location,date,time,venue,status,school_id");
    if (school_id) query = query.eq("school_id", school_id);
    const { data, error } = await query.order("date", { ascending: true });
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data });
  }

  static async create(req: Request, res: Response) {
    const body = req.body || {};
    if (!body.school_id || !body.title || !body.date) {
      return res.status(400).json({ success: false, message: "school_id, title, date are required" });
    }
    const { data, error } = await supabase
      .from("events")
      .insert({
        school_id: Number(body.school_id),
        title: String(body.title),
        description: body.description ?? null,
        location: body.location ?? null,
        date: String(body.date),
        time: body.time ?? null,
        venue: body.venue ?? null,
        status: body.status ?? 'upcoming',
      })
      .select()
      .single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.status(201).json({ success: true, message: "Created", data });
  }

  static async patch(req: Request, res: Response) {
    const body = req.body || {};
    if (!body.id) return res.status(400).json({ success: false, message: "id is required" });
    const id = Number(body.id);
    const input: any = {};
    ["title","description","location","date","time","venue","status","school_id"].forEach((k) => {
      if (body[k] !== undefined) input[k] = body[k];
    });
    const { data, error } = await supabase.from("events").update(input).eq("id", id).select().single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Updated", data });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  }
}