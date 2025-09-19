import { Request, Response } from "express";
import { SubjectService } from "../services/SubjectService";

export class SubjectController {
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);
    const school_id = req.query.school_id ? Number(req.query.school_id) : undefined;
    const class_id = req.query.class_id ? Number(req.query.class_id) : undefined;
    const result = await SubjectService.list({ school_id, class_id }, page, limit);
    res.json({ success: true, message: "OK", data: result.data, pagination: result.pagination });
  }

  static async create(req: Request, res: Response) {
    const body = req.body || {};
    if (!body.school_id || !body.class_id || !body.subject_name) {
      return res.status(400).json({ success: false, message: "school_id, class_id, subject_name are required" });
    }
    const row = await SubjectService.create({
      school_id: Number(body.school_id),
      class_id: Number(body.class_id),
      subject_name: String(body.subject_name),
      teacher_id: body.teacher_id ? Number(body.teacher_id) : null,
    } as any);
    res.status(201).json({ success: true, message: "Created", data: row });
  }

  static async patch(req: Request, res: Response) {
    const body = req.body || {};
    if (!body.id) return res.status(400).json({ success: false, message: "id is required" });
    const id = Number(body.id);
    const input: any = {};
    ["subject_name","teacher_id","class_id","school_id"].forEach((k) => {
      if (body[k] !== undefined) input[k] = body[k];
    });
    const row = await SubjectService.update(id, input);
    res.json({ success: true, message: "Updated", data: row });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const ok = await SubjectService.remove(id);
    res.json({ success: ok, message: ok ? "Deleted" : "Not deleted" });
  }

  static async listByClassName(req: Request, res: Response) {
    const className = decodeURIComponent(String(req.params.className || "")).trim();
    if (!className) return res.status(400).json({ success: false, message: "className path param is required" });
    const result = await SubjectService.listByClassName(className);
    res.json({ success: true, message: "OK", ...result });
  }
}