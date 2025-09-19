import { DatabaseService } from "./database";
import { supabase } from "../config/database";
import { Database } from "../types/database";

export class SubjectService {
  static async list(filters: { school_id?: number; class_id?: number }, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const data = await DatabaseService.findAll("subjects", {
      filters,
      orderBy: "id",
      orderDirection: "asc",
      limit,
      offset,
    });
    const total = await DatabaseService.count("subjects", filters);
    return { data, pagination: { page, limit, total, totalPages: Math.ceil((total || 0) / limit) } };
  }

  static async create(payload: Database['public']['Tables']['subjects']['Insert']) {
    return DatabaseService.create("subjects", payload);
  }

  static async update(id: number, payload: Database['public']['Tables']['subjects']['Update']) {
    return DatabaseService.update("subjects", id, payload);
  }

  static async remove(id: number) {
    return DatabaseService.delete("subjects", id);
  }

  // Fetch subjects by human-readable class name used in UI
  static async listByClassName(className: string) {
    // Find class by name (case-insensitive)
    const { data: classes, error: classErr } = await supabase
      .from("classes")
      .select("id,name,section,school_id")
      .ilike("name", className);

    if (classErr) throw classErr;
    const cls = (classes || [])[0];
    if (!cls) {
      return { class: null as any, subjects: [] as Array<{ id: string; subject_id: string; subject_name: string; teacher_name?: string }> };
    }

    // Fetch subjects for class
    const { data: subjects, error: subErr } = await supabase
      .from("subjects")
      .select("id,subject_name,teacher_id")
      .eq("class_id", cls.id)
      .order("id", { ascending: true });

    if (subErr) throw subErr;

    const teacherIds = Array.from(new Set((subjects || []).map(s => s.teacher_id).filter(Boolean))) as number[];
    let teacherMap: Record<number, string> = {};
    if (teacherIds.length) {
      const { data: teachers, error: tErr } = await supabase
        .from("teacher_profiles")
        .select("id,name")
        .in("id", teacherIds);
      if (tErr) throw tErr;
      teacherMap = Object.fromEntries((teachers || []).map((t: any) => [t.id, t.name]));
    }

    const mapped = (subjects || []).map((s, idx) => ({
      id: String(idx + 1),
      subject_id: String(s.id),
      subject_name: s.subject_name as string,
      teacher_name: s.teacher_id ? teacherMap[s.teacher_id as number] : undefined,
    }));

    return { class: cls, subjects: mapped };
  }
}