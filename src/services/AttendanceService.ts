import { DatabaseService } from "./database";
import { supabase } from "../config/database";
import { Database } from "../types/database";

export class AttendanceService {
  // Upsert attendance per student/date/class
  static async upsert(payload: { student_id: number; class_id: number; date: string; status: 'present'|'absent'|'late' }) {
    // Check if exists
    const { data: existing, error } = await supabase
      .from("student_attendance")
      .select("id")
      .eq("student_id", payload.student_id)
      .eq("class_id", payload.class_id)
      .eq("date", payload.date)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    if (existing?.id) {
      return DatabaseService.update("student_attendance", existing.id, { status: payload.status } as Database['public']['Tables']['student_attendance']['Update']);
    } else {
      return DatabaseService.create("student_attendance", {
        student_id: payload.student_id,
        class_id: payload.class_id,
        date: payload.date,
        status: payload.status,
      } as Database['public']['Tables']['student_attendance']['Insert']);
    }
  }
}