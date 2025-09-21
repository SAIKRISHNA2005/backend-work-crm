import { BaseModel, BaseInsert, BaseUpdate, DateString, EnquiryStatus, ReminderStatus } from './base';
import { School } from './school';
import { Class } from './school';
import { User } from './user';
import { StudentProfile } from './student';

// Announcement Model
export interface Announcement extends BaseModel {
  school_id?: number;
  class_id?: number;
  title?: string;
  description?: string;
  date?: DateString;
  created_by?: number;
}

export interface AnnouncementInsert extends BaseInsert {
  school_id?: number;
  class_id?: number;
  title?: string;
  description?: string;
  date?: DateString;
  created_by?: number;
}

export interface AnnouncementUpdate extends BaseUpdate {
  school_id?: number;
  class_id?: number;
  title?: string;
  description?: string;
  date?: DateString;
  created_by?: number;
}

// Achievement Model
export interface Achievement extends BaseModel {
  student_id: number;
  title?: string;
  description?: string;
  date?: DateString;
  location?: string;
  award_type?: string;
}

export interface AchievementInsert extends BaseInsert {
  student_id: number;
  title?: string;
  description?: string;
  date?: DateString;
  location?: string;
  award_type?: string;
}

export interface AchievementUpdate extends BaseUpdate {
  student_id?: number;
  title?: string;
  description?: string;
  date?: DateString;
  location?: string;
  award_type?: string;
}

// Reminder Model
export interface Reminder extends BaseModel {
  user_id: number;
  title?: string;
  description?: string;
  reminder_date?: DateString;
  status: ReminderStatus;
}

export interface ReminderInsert extends BaseInsert {
  user_id: number;
  title?: string;
  description?: string;
  reminder_date?: DateString;
  status?: ReminderStatus;
}

export interface ReminderUpdate extends BaseUpdate {
  user_id?: number;
  title?: string;
  description?: string;
  reminder_date?: DateString;
  status?: ReminderStatus;
}

// Enquiry Model
export interface Enquiry extends BaseModel {
  user_id: number;
  subject?: string;
  category?: string;
  description?: string;
  status: EnquiryStatus;
  date?: DateString;
  priority?: string;
  last_update?: DateString;
  actions_taken?: string;
  attachment_url?: string;
}

export interface EnquiryInsert extends BaseInsert {
  user_id: number;
  subject?: string;
  category?: string;
  description?: string;
  status?: EnquiryStatus;
  date?: DateString;
  priority?: string;
  last_update?: DateString;
  actions_taken?: string;
  attachment_url?: string;
}

export interface EnquiryUpdate extends BaseUpdate {
  user_id?: number;
  subject?: string;
  category?: string;
  description?: string;
  status?: EnquiryStatus;
  date?: DateString;
  priority?: string;
  last_update?: DateString;
  actions_taken?: string;
  attachment_url?: string;
}

// Communication with related data
export interface AnnouncementWithDetails extends Announcement {
  school?: School;
  class?: Class;
  created_by_user?: User;
}

export interface AchievementWithDetails extends Achievement {
  student: StudentProfile;
}

export interface ReminderWithDetails extends Reminder {
  user: User;
}

export interface EnquiryWithDetails extends Enquiry {
  user: User;
}

// Communication search and filter
export interface AnnouncementSearchParams {
  title?: string;
  school_id?: number;
  class_id?: number;
  created_by?: number;
  date?: DateString;
  start_date?: DateString;
  end_date?: DateString;
}

export interface AchievementSearchParams {
  student_id?: number;
  title?: string;
  award_type?: string;
  date?: DateString;
  start_date?: DateString;
  end_date?: DateString;
}

export interface ReminderSearchParams {
  user_id?: number;
  title?: string;
  status?: ReminderStatus;
  reminder_date?: DateString;
  start_date?: DateString;
  end_date?: DateString;
}

export interface EnquirySearchParams {
  user_id?: number;
  subject?: string;
  category?: string;
  status?: EnquiryStatus;
  priority?: string;
  date?: DateString;
  start_date?: DateString;
  end_date?: DateString;
}

// Communication statistics
export interface CommunicationStats {
  total_announcements: number;
  total_achievements: number;
  total_reminders: number;
  total_enquiries: number;
  pending_enquiries: number;
  completed_reminders: number;
}

// Dashboard data
export interface CommunicationDashboard {
  recent_announcements: AnnouncementWithDetails[];
  upcoming_reminders: ReminderWithDetails[];
  pending_enquiries: EnquiryWithDetails[];
  recent_achievements: AchievementWithDetails[];
  stats: CommunicationStats;
}

// Re-export for convenience
export type { Announcement, Achievement, Reminder, Enquiry };
