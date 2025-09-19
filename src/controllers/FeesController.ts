import { Request, Response } from "express";
import { supabase } from "../config/database";

export class FeeStructureController {
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const class_id = req.query.class_id ? Number(req.query.class_id) : undefined;

    let query = supabase.from("fee_structure").select("*", { count: "exact" });
    if (class_id) query = query.eq("class_id", class_id);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.order("due_date", { ascending: true }).range(from, to);

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data, pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0)/limit) } });
  }

  static async create(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.class_id || !b.fee_name || b.amount === undefined) {
      return res.status(400).json({ success: false, message: "class_id, fee_name, amount are required" });
    }
    const { data, error } = await supabase.from("fee_structure").insert({
      class_id: Number(b.class_id),
      fee_name: String(b.fee_name),
      description: b.description ?? null,
      amount: b.amount,
      due_date: b.due_date ?? null,
    }).select().single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.status(201).json({ success: true, message: "Created", data });
  }

  static async patch(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.id) return res.status(400).json({ success: false, message: "id is required" });
    const id = Number(b.id);
    const input: any = {};
    ["class_id","fee_name","description","amount","due_date"].forEach((k) => {
      if (b[k] !== undefined) input[k] = b[k];
    });
    const { data, error } = await supabase.from("fee_structure").update(input).eq("id", id).select().single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Updated", data });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const { error } = await supabase.from("fee_structure").delete().eq("id", id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  }
}

export class FeePaymentsController {
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const student_id = req.query.student_id ? Number(req.query.student_id) : undefined;
    const class_id = req.query.class_id ? Number(req.query.class_id) : undefined;
    const status = req.query.status ? String(req.query.status) as 'paid' | 'pending' : undefined;

    let query = supabase.from("fee_payments").select("*", { count: "exact" });
    if (student_id) query = query.eq("student_id", student_id);
    if (class_id) query = query.eq("class_id", class_id);
    if (status) query = query.eq("status", status);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.order("payment_date", { ascending: false }).range(from, to);

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "OK", data, pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0)/limit) } });
  }

  static async create(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.student_id || !b.class_id || !b.fee_id || !b.status) {
      return res.status(400).json({ success: false, message: "student_id, class_id, fee_id, status are required" });
    }
    const { data, error } = await supabase.from("fee_payments").insert({
      student_id: Number(b.student_id),
      class_id: Number(b.class_id),
      fee_id: Number(b.fee_id),
      status: b.status,
      payment_date: b.payment_date ?? null,
      transaction_id: b.transaction_id ?? null,
    }).select().single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    res.status(201).json({ success: true, message: "Created", data });
  }

  static async patch(req: Request, res: Response) {
    const b = req.body || {};
    if (!b.id) return res.status(400).json({ success: false, message: "id is required" });
    const id = Number(b.id);
    const input: any = {};
    ["student_id","class_id","fee_id","status","payment_date","transaction_id"].forEach((k) => {
      if (b[k] !== undefined) input[k] = b[k];
    });
    const { data, error } = await supabase.from("fee_payments").update(input).eq("id", id).select().single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Updated", data });
  }

  static async remove(req: Request, res: Response) {
    const id = req.query.id ? Number(req.query.id) : undefined;
    if (!id) return res.status(400).json({ success: false, message: "id query param is required" });
    const { error } = await supabase.from("fee_payments").delete().eq("id", id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  }
}