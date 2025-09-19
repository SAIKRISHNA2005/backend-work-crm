import { Request, Response } from "express";
import { MarksService } from "../services/MarksService";
import { ApiResponse } from "../types";

export class MarksController {
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const student_id = req.query.student_id ? Number(req.query.student_id) : undefined;
    const exam_subject_id = req.query.exam_subject_id ? Number(req.query.exam_subject_id) : undefined;

    const result = await MarksService.list({ student_id, exam_subject_id }, page, limit);
    const response: ApiResponse = { success: true, message: "OK", data: result.data, pagination: result.pagination };
    res.json(response);
  }

  static async create(req: Request, res: Response) {
    const { student_id, exam_subject_id, marks_obtained, grade } = req.body || {};
    if (student_id == null || exam_subject_id == null || marks_obtained == null) {
      return res.status(400).json({ success: false, message: "student_id, exam_subject_id, marks_obtained are required" });
    }
    const row = await MarksService.create({
      student_id: Number(student_id),
      exam_subject_id: Number(exam_subject_id),
      marks_obtained: Number(marks_obtained),
      grade: grade ?? null,
    } as any);
    res.status(201).json({ success: true, message: "Created", data: row });
  }

  static async patch(req: Request, res: Response) {
    const { id, marks_obtained, grade } = req.body || {};
    if (!id) return res.status(400).json({ success: false, message: "id is required" });
    const payload: any = {};
    if (marks_obtained != null) payload.marks_obtained = Number(marks_obtained);
    if (grade != null) payload.grade = String(grade);
    const row = await MarksService.update(Number(id), payload);
    res.json({ success: true, message: "Updated", data: row });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const ok = await MarksService.delete(id);
    res.json({ success: ok, message: ok ? "Deleted" : "Not deleted" });
  }
}