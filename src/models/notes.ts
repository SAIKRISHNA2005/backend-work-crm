import { BaseModel, BaseInsert, BaseUpdate, DateString, SectionType, Visibility } from './base';
import { Class } from './school';
import { Subject } from './subject';
import { User } from './user';
import { TeacherProfile } from './teacher';

// Digital Notes Model
export interface DigitalNote extends BaseModel {
  class_id: number;
  subject_id: number;
  section_type: SectionType;
  title?: string;
  description?: string;
  resource_url?: string;
  file_type?: string;
  uploaded_at: DateString;
  due_date?: DateString;
  is_important: boolean;
  added_by_id?: number;
  last_seen_at?: DateString;
}

export interface DigitalNoteInsert extends BaseInsert {
  class_id: number;
  subject_id: number;
  section_type: SectionType;
  title?: string;
  description?: string;
  resource_url?: string;
  file_type?: string;
  uploaded_at?: DateString;
  due_date?: DateString;
  is_important?: boolean;
  added_by_id?: number;
  last_seen_at?: DateString;
}

export interface DigitalNoteUpdate extends BaseUpdate {
  class_id?: number;
  subject_id?: number;
  section_type?: SectionType;
  title?: string;
  description?: string;
  resource_url?: string;
  file_type?: string;
  uploaded_at?: DateString;
  due_date?: DateString;
  is_important?: boolean;
  added_by_id?: number;
  last_seen_at?: DateString;
}

// Teacher Notes Model
export interface TeacherNote extends BaseModel {
  teacher_id: number;
  class_id: number;
  subject_id?: number;
  title?: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  uploaded_at: DateString;
  is_published: boolean;
  visibility?: Visibility;
  available_from?: DateString;
  available_until?: DateString;
  tags?: string;
}

export interface TeacherNoteInsert extends BaseInsert {
  teacher_id: number;
  class_id: number;
  subject_id?: number;
  title?: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  uploaded_at?: DateString;
  is_published?: boolean;
  visibility?: Visibility;
  available_from?: DateString;
  available_until?: DateString;
  tags?: string;
}

export interface TeacherNoteUpdate extends BaseUpdate {
  teacher_id?: number;
  class_id?: number;
  subject_id?: number;
  title?: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  uploaded_at?: DateString;
  is_published?: boolean;
  visibility?: Visibility;
  available_from?: DateString;
  available_until?: DateString;
  tags?: string;
}

// Notes with related data
export interface DigitalNoteWithDetails extends DigitalNote {
  class: Class;
  subject: Subject;
  added_by?: User;
}

export interface TeacherNoteWithDetails extends TeacherNote {
  teacher: TeacherProfile;
  class: Class;
  subject?: Subject;
}

// Notes search and filter
export interface DigitalNoteSearchParams {
  class_id?: number;
  subject_id?: number;
  section_type?: SectionType;
  title?: string;
  file_type?: string;
  is_important?: boolean;
  added_by_id?: number;
  uploaded_from?: DateString;
  uploaded_to?: DateString;
  due_date_from?: DateString;
  due_date_to?: DateString;
}

export interface TeacherNoteSearchParams {
  teacher_id?: number;
  class_id?: number;
  subject_id?: number;
  title?: string;
  file_type?: string;
  is_published?: boolean;
  visibility?: Visibility;
  uploaded_from?: DateString;
  uploaded_to?: DateString;
  available_from?: DateString;
  available_to?: DateString;
  tags?: string;
}

// Notes statistics
export interface NotesStats {
  total_digital_notes: number;
  total_teacher_notes: number;
  notes_by_type: Record<SectionType, number>;
  notes_by_visibility: Record<Visibility, number>;
  notes_by_file_type: Record<string, number>;
  published_notes: number;
  unpublished_notes: number;
}

// Student notes dashboard
export interface StudentNotesDashboard {
  class_id: number;
  class_name: string;
  recent_notes: DigitalNoteWithDetails[];
  important_notes: DigitalNoteWithDetails[];
  assignments: DigitalNoteWithDetails[];
  videos: DigitalNoteWithDetails[];
  teacher_notes: TeacherNoteWithDetails[];
  stats: {
    total_notes: number;
    assignments_due: number;
    videos_available: number;
    teacher_notes: number;
  };
}

// Teacher notes dashboard
export interface TeacherNotesDashboard {
  teacher_id: number;
  teacher_name: string;
  my_notes: TeacherNoteWithDetails[];
  published_notes: TeacherNoteWithDetails[];
  unpublished_notes: TeacherNoteWithDetails[];
  class_notes: Record<string, DigitalNoteWithDetails[]>;
  stats: {
    total_notes: number;
    published_notes: number;
    unpublished_notes: number;
    notes_by_class: Record<string, number>;
  };
}

// File upload
export interface FileUpload {
  file: File;
  class_id: number;
  subject_id: number;
  section_type: SectionType;
  title?: string;
  description?: string;
  is_important?: boolean;
}

export interface TeacherFileUpload {
  file: File;
  teacher_id: number;
  class_id: number;
  subject_id?: number;
  title?: string;
  description?: string;
  visibility?: Visibility;
  available_from?: DateString;
  available_until?: DateString;
  tags?: string;
}

// Re-export for convenience
export type { DigitalNote, TeacherNote };
