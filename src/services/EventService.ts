import { supabase } from '../config/database';
import { CustomError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class EventService {

  static async getAllEvents(filters: any = {}, pagination: { limit: number; offset: number } = { limit: 10, offset: 0 }) {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          schools:school_id (
            id,
            name,
            school_code
          )
        `);

      // Apply filters
      if (filters.school_id) {
        query = query.eq('school_id', filters.school_id);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.dateFrom) {
        query = query.gte('event_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('event_date', filters.dateTo);
      }

      // Apply pagination
      query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);

      const { data, error } = await query.order('event_date', { ascending: false });

      if (error) {
        logger.error('Error fetching events:', error);
        throw new CustomError('Failed to fetch events', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('EventService.getAllEvents error:', error);
      throw error;
    }
  }

  static async getEventCount(filters: any = {}) {
    try {
      let query = supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters.school_id) {
        query = query.eq('school_id', filters.school_id);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.dateFrom) {
        query = query.gte('event_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('event_date', filters.dateTo);
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Error counting events:', error);
        throw new CustomError('Failed to count events', 500);
      }

      return count || 0;
    } catch (error) {
      logger.error('EventService.getEventCount error:', error);
      throw error;
    }
  }

  static async getEventById(id: number) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          schools:school_id (
            id,
            name,
            school_code
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error fetching event by ID:', error);
        throw new CustomError('Failed to fetch event', 500);
      }

      return data;
    } catch (error) {
      logger.error('EventService.getEventById error:', error);
      throw error;
    }
  }

  static async createEvent(eventData: any) {
    try {
      const recordData = {
        ...eventData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('events')
        .insert([recordData])
        .select(`
          *,
          schools:school_id (
            id,
            name,
            school_code
          )
        `)
        .single();

      if (error) {
        logger.error('Error creating event:', error);
        throw new CustomError('Failed to create event', 500);
      }

      return data;
    } catch (error) {
      logger.error('EventService.createEvent error:', error);
      throw error;
    }
  }

  static async updateEvent(id: number, updateData: any) {
    try {
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          schools:school_id (
            id,
            name,
            school_code
          )
        `)
        .single();

      if (error) {
        logger.error('Error updating event:', error);
        throw new CustomError('Failed to update event', 500);
      }

      return data;
    } catch (error) {
      logger.error('EventService.updateEvent error:', error);
      throw error;
    }
  }

  static async getEventsBySchool(schoolId: number) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          schools:school_id (
            id,
            name,
            school_code
          )
        `)
        .eq('school_id', schoolId)
        .order('event_date', { ascending: false });

      if (error) {
        logger.error('Error fetching events by school:', error);
        throw new CustomError('Failed to fetch events by school', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('EventService.getEventsBySchool error:', error);
      throw error;
    }
  }

  static async getUpcomingEvents(filters: any = {}, pagination: { limit: number } = { limit: 10 }) {
    try {
      const today = new Date().toISOString().split('T')[0];

      let query = supabase
        .from('events')
        .select(`
          *,
          schools:school_id (
            id,
            name,
            school_code
          )
        `)
        .gte('event_date', today)
        .eq('status', 'upcoming');

      // Apply filters
      if (filters.school_id) {
        query = query.eq('school_id', filters.school_id);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      // Apply pagination
      query = query.limit(pagination.limit);

      const { data, error } = await query.order('event_date', { ascending: true });

      if (error) {
        logger.error('Error fetching upcoming events:', error);
        throw new CustomError('Failed to fetch upcoming events', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('EventService.getUpcomingEvents error:', error);
      throw error;
    }
  }

  static async getPastEvents(filters: any = {}, pagination: { limit: number; offset: number } = { limit: 10, offset: 0 }) {
    try {
      const today = new Date().toISOString().split('T')[0];

      let query = supabase
        .from('events')
        .select(`
          *,
          schools:school_id (
            id,
            name,
            school_code
          )
        `)
        .lt('event_date', today)
        .eq('status', 'completed');

      // Apply filters
      if (filters.school_id) {
        query = query.eq('school_id', filters.school_id);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      // Apply pagination
      query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);

      const { data, error } = await query.order('event_date', { ascending: false });

      if (error) {
        logger.error('Error fetching past events:', error);
        throw new CustomError('Failed to fetch past events', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('EventService.getPastEvents error:', error);
      throw error;
    }
  }

  static async getEventStats(filters: any = {}) {
    try {
      // Get total event count
      const totalEvents = await this.getEventCount(filters);

      // Get events by status
      const { data: eventsByStatus, error: statusError } = await supabase
        .from('events')
        .select('status')
        .not('status', 'is', null);

      if (statusError) {
        logger.error('Error fetching events by status:', statusError);
        throw new CustomError('Failed to fetch event statistics', 500);
      }

      // Count events by status
      const statusCounts = eventsByStatus?.reduce((acc: any, event) => {
        const status = event.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {}) || {};

      // Get events by category
      const { data: eventsByCategory, error: categoryError } = await supabase
        .from('events')
        .select('category')
        .not('category', 'is', null);

      if (categoryError) {
        logger.error('Error fetching events by category:', categoryError);
        throw new CustomError('Failed to fetch event statistics', 500);
      }

      // Count events by category
      const categoryCounts = eventsByCategory?.reduce((acc: any, event) => {
        const category = event.category || 'Unknown';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        totalEvents,
        statusCounts,
        categoryCounts,
        period: 'All time'
      };
    } catch (error) {
      logger.error('EventService.getEventStats error:', error);
      throw error;
    }
  }

  static async deleteEvent(id: number) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Error deleting event:', error);
        throw new CustomError('Failed to delete event', 500);
      }

      return true;
    } catch (error) {
      logger.error('EventService.deleteEvent error:', error);
      throw error;
    }
  }

  static async updateEventStatus(id: number, status: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          schools:school_id (
            id,
            name,
            school_code
          )
        `)
        .single();

      if (error) {
        logger.error('Error updating event status:', error);
        throw new CustomError('Failed to update event status', 500);
      }

      return data;
    } catch (error) {
      logger.error('EventService.updateEventStatus error:', error);
      throw error;
    }
  }

  static async getEventsByDateRange(startDate: string, endDate: string, schoolId?: number) {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          schools:school_id (
            id,
            name,
            school_code
          )
        `)
        .gte('event_date', startDate)
        .lte('event_date', endDate);

      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }

      const { data, error } = await query.order('event_date', { ascending: true });

      if (error) {
        logger.error('Error fetching events by date range:', error);
        throw new CustomError('Failed to fetch events by date range', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('EventService.getEventsByDateRange error:', error);
      throw error;
    }
  }
}
