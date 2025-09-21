import { BaseModel, BaseInsert, BaseUpdate, DateString, EventType } from './base';
import { Class } from './school';
import { School } from './school';

// Academic Calendar Model
export interface AcademicCalendar extends BaseModel {
  class_id?: number;
  school_id?: number;
  month: number;
  event_type: EventType;
  title?: string;
  description?: string;
  start_date?: DateString;
  end_date?: DateString;
}

export interface AcademicCalendarInsert extends BaseInsert {
  class_id?: number;
  school_id?: number;
  month: number;
  event_type: EventType;
  title?: string;
  description?: string;
  start_date?: DateString;
  end_date?: DateString;
}

export interface AcademicCalendarUpdate extends BaseUpdate {
  class_id?: number;
  school_id?: number;
  month?: number;
  event_type?: EventType;
  title?: string;
  description?: string;
  start_date?: DateString;
  end_date?: DateString;
}

// Calendar with related data
export interface AcademicCalendarWithDetails extends AcademicCalendar {
  class?: Class;
  school?: School;
}

// Calendar search and filter
export interface CalendarSearchParams {
  class_id?: number;
  school_id?: number;
  month?: number;
  event_type?: EventType;
  title?: string;
  start_date?: DateString;
  end_date?: DateString;
  year?: number;
}

// Monthly calendar view
export interface MonthlyCalendar {
  month: number;
  year: number;
  events: CalendarEvent[];
}

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  event_type: EventType;
  start_date: DateString;
  end_date?: DateString;
  class_name?: string;
  school_name?: string;
}

// Calendar statistics
export interface CalendarStats {
  total_events: number;
  events_by_type: Record<EventType, number>;
  events_by_month: Record<number, number>;
  upcoming_events: number;
  past_events: number;
}

// Calendar dashboard
export interface CalendarDashboard {
  current_month: MonthlyCalendar;
  upcoming_events: CalendarEvent[];
  recent_events: CalendarEvent[];
  stats: CalendarStats;
}

// Re-export for convenience
export type { AcademicCalendar };
