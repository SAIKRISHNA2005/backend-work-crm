import { DatabaseService } from "./database";
import { Database } from "../types/database";

export class MarksService {
  static async list(filters: { student_id?: number; exam_subject_id?: number }, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const data = await DatabaseService.findAll("marks", {
      filters,
      orderBy: "id",
      orderDirection: "asc",
      limit,
      offset,
    });
    const total = await DatabaseService.count("marks", filters);
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async create(payload: Database['public']['Tables']['marks']['Insert']) {
    return DatabaseService.create("marks", payload);
  }

  static async update(id: number, payload: Database['public']['Tables']['marks']['Update']) {
    return DatabaseService.update("marks", id, payload);
  }

  static async delete(id: number) {
    return DatabaseService.delete("marks", id);
  }
}