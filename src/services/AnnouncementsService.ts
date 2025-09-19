import { DatabaseService } from "./database";
import { Database } from "../types/database";
import { supabase } from "../config/database";

export class AnnouncementsService {
  static async list(filters: { school_id?: number; class_id?: number }, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const data = await DatabaseService.findAll("announcements" as any, {
      filters,
      orderBy: "created_at",
      orderDirection: "desc",
      limit,
      offset,
    });
    const total = await DatabaseService.count("announcements" as any, filters);
    return { data, pagination: { page, limit, total, totalPages: Math.ceil((total || 0) / limit) } };
  }

  static async create(payload: Database['public']['Tables']['announcements']['Insert']) {
    return DatabaseService.create("announcements" as any, payload);
  }

  static async update(id: number, payload: Database['public']['Tables']['announcements']['Update']) {
    return DatabaseService.update("announcements" as any, id, payload);
  }

  static async remove(id: number) {
    return DatabaseService.delete("announcements" as any, id);
  }
}