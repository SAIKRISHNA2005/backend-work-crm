import { DatabaseService } from "./database";
import { Database } from "../types/database";

export class NotesService {
  static async createDigitalNote(payload: Database['public']['Tables']['digital_notes']['Insert']) {
    return DatabaseService.create("digital_notes", payload);
  }
}