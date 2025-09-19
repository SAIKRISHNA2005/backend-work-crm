import { Request, Response } from "express";
import { supabase } from "../config/database";

export class LeaderboardController {
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const class_id = req.query.class_id ? Number(req.query.class_id) : undefined;
    const school_id = req.query.school_id ? Number(req.query.school_id) : undefined;

    let query = supabase.from("leaderboard").select("*", { count: "exact" });
    if (class_id) query = query.eq("class_id", class_id);
    if (school_id) query = query.eq("school_id", school_id);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.order("overall_rank", { ascending: true }).range(from, to);

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data, pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0)/limit) } });
  }

  static async upsert(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.student_id || !b.class_id || !b.school_id) {
      return res.status(400).json({ success: false, message: "student_id, class_id, school_id are required" });
    }
    // We don't have a unique constraint here; using manual upsert by (student_id, class_id)
    const input = {
      student_id: Number(b.student_id),
      class_id: Number(b.class_id),
      school_id: Number(b.school_id),
      xp: b.xp ?? null,
      percentage: b.percentage ?? null,
      classwise_rank: b.classwise_rank ?? null,
      overall_rank: b.overall_rank ?? null,
    };

    // Try to find existing record
    const { data: existing } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("student_id", input.student_id)
      .eq("class_id", input.class_id)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("leaderboard")
        .update(input)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.json({ success: true, message: "Updated", data });
    } else {
      const { data, error } = await supabase
        .from("leaderboard")
        .insert(input)
        .select()
        .single();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.status(201).json({ success: true, message: "Created", data });
    }
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const { error } = await supabase.from("leaderboard").delete().eq("id", id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  }
}