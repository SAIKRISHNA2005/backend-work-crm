import { BaseModel, BaseInsert, BaseUpdate, DateString, TimeString, EventStatus } from './base';
import { School } from './school';
import { StudentProfile } from './student';

// Event Model
export interface Event extends BaseModel {
  school_id?: number;
  title?: string;
  description?: string;
  location?: string;
  date?: DateString;
  time?: TimeString;
  venue?: string;
  status?: EventStatus;
}

export interface EventInsert extends BaseInsert {
  school_id?: number;
  title?: string;
  description?: string;
  location?: string;
  date?: DateString;
  time?: TimeString;
  venue?: string;
  status?: EventStatus;
}

export interface EventUpdate extends BaseUpdate {
  school_id?: number;
  title?: string;
  description?: string;
  location?: string;
  date?: DateString;
  time?: TimeString;
  venue?: string;
  status?: EventStatus;
}

// Student Event Registration Model
export interface StudentEventRegistration extends BaseModel {
  student_id: number;
  event_id: number;
  registration_status: string;
}

export interface StudentEventRegistrationInsert extends BaseInsert {
  student_id: number;
  event_id: number;
  registration_status: string;
}

export interface StudentEventRegistrationUpdate extends BaseUpdate {
  student_id?: number;
  event_id?: number;
  registration_status?: string;
}

// Event with related data
export interface EventWithDetails extends Event {
  school?: School;
  registrations: StudentEventRegistrationWithDetails[];
  total_registrations: number;
}

export interface StudentEventRegistrationWithDetails extends StudentEventRegistration {
  student: StudentProfile;
  event: Event;
}

// Event search and filter
export interface EventSearchParams {
  title?: string;
  school_id?: number;
  date?: DateString;
  start_date?: DateString;
  end_date?: DateString;
  status?: EventStatus;
  location?: string;
}

// Event statistics
export interface EventStats {
  total_events: number;
  upcoming_events: number;
  past_events: number;
  total_registrations: number;
  average_registrations_per_event: number;
}

// Event calendar
export interface EventCalendar {
  date: DateString;
  events: Event[];
}

// Event registration summary
export interface EventRegistrationSummary {
  event_id: number;
  event_title: string;
  event_date: DateString;
  total_registrations: number;
  registrations_by_class: Record<string, number>;
  top_registrants: StudentProfile[];
}

// Re-export for convenience
export type { Event, StudentEventRegistration };
