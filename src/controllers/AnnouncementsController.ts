import { Request, Response } from "express";
import { AnnouncementsService } from "../services/AnnouncementsService";

export class AnnouncementsController {
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const school_id = req.query.school_id ? Number(req.query.school_id) : undefined;
    const class_id = req.query.class_id ? Number(req.query.class_id) : undefined;
    const result = await AnnouncementsService.list({ school_id, class_id }, page, limit);
    res.json({ success: true, message: "OK", data: result.data, pagination: result.pagination });
  }

  static async create(req: Request, res: Response) {
    const body = req.body || {};
    if (!body.school_id || !body.title || !body.date) {
      return res.status(400).json({ success: false, message: "school_id, title, date are required" });
    }
    const row = await AnnouncementsService.create({
      school_id: Number(body.school_id),
      class_id: body.class_id ? Number(body.class_id) : null,
      title: String(body.title),
      description: body.description ?? null,
      date: body.date,
      created_by: body.created_by ?? null,
    } as any);
    res.status(201).json({ success: true, message: "Created", data: row });
  }

  static async patch(req: Request, res: Response) {
    const body = req.body || {};
    if (!body.id) return res.status(400).json({ success: false, message: "id is required" });
    const id = Number(body.id);
    const input: any = {};
    ["title","description","date","class_id","school_id","created_by"].forEach((k) => {
      if (body[k] !== undefined) input[k] = body[k];
    });
    const row = await AnnouncementsService.update(id, input);
    res.json({ success: true, message: "Updated", data: row });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const ok = await AnnouncementsService.remove(id);
    res.json({ success: ok, message: ok ? "Deleted" : "Not deleted" });
  }
}