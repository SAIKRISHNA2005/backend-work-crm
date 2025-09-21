import { supabase } from '../config/database';
import { CustomError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class TimetableService {

  static async getTimetableEntries(filters: any = {}, pagination: { limit: number; offset: number } = { limit: 10, offset: 0 }) {
    try {
      let query = supabase
        .from('timetable')
        .select(`
          *,
          classes:class_id (
            id,
            name,
            class_code
          ),
          subjects:subject_id (
            id,
            name,
            subject_code
          ),
          teachers:teacher_id (
            id,
            name,
            email
          )
        `);

      // Apply filters
      if (filters.class_id) {
        query = query.eq('class_id', filters.class_id);
      }
      if (filters.teacher_id) {
        query = query.eq('teacher_id', filters.teacher_id);
      }
      if (filters.day_of_week) {
        query = query.eq('day_of_week', filters.day_of_week);
      }
      if (filters.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }

      // Apply pagination
      query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);

      const { data, error } = await query.order('day_of_week, start_time', { ascending: true });

      if (error) {
        logger.error('Error fetching timetable entries:', error);
        throw new CustomError('Failed to fetch timetable entries', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('TimetableService.getTimetableEntries error:', error);
      throw error;
    }
  }

  static async getTimetableEntryCount(filters: any = {}) {
    try {
      let query = supabase
        .from('timetable')
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters.class_id) {
        query = query.eq('class_id', filters.class_id);
      }
      if (filters.teacher_id) {
        query = query.eq('teacher_id', filters.teacher_id);
      }
      if (filters.day_of_week) {
        query = query.eq('day_of_week', filters.day_of_week);
      }
      if (filters.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Error counting timetable entries:', error);
        throw new CustomError('Failed to count timetable entries', 500);
      }

      return count || 0;
    } catch (error) {
      logger.error('TimetableService.getTimetableEntryCount error:', error);
      throw error;
    }
  }

  static async createTimetableEntry(entryData: any) {
    try {
      const recordData = {
        ...entryData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('timetable')
        .insert([recordData])
        .select(`
          *,
          classes:class_id (
            id,
            name,
            class_code
          ),
          subjects:subject_id (
            id,
            name,
            subject_code
          ),
          teachers:teacher_id (
            id,
            name,
            email
          )
        `)
        .single();

      if (error) {
        logger.error('Error creating timetable entry:', error);
        throw new CustomError('Failed to create timetable entry', 500);
      }

      return data;
    } catch (error) {
      logger.error('TimetableService.createTimetableEntry error:', error);
      throw error;
    }
  }

  static async updateTimetableEntry(id: number, updateData: any) {
    try {
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('timetable')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          classes:class_id (
            id,
            name,
            class_code
          ),
          subjects:subject_id (
            id,
            name,
            subject_code
          ),
          teachers:teacher_id (
            id,
            name,
            email
          )
        `)
        .single();

      if (error) {
        logger.error('Error updating timetable entry:', error);
        throw new CustomError('Failed to update timetable entry', 500);
      }

      return data;
    } catch (error) {
      logger.error('TimetableService.updateTimetableEntry error:', error);
      throw error;
    }
  }

  static async getTimetableByClass(classId: number) {
    try {
      const { data, error } = await supabase
        .from('timetable')
        .select(`
          *,
          subjects:subject_id (
            id,
            name,
            subject_code
          ),
          teachers:teacher_id (
            id,
            name,
            email
          )
        `)
        .eq('class_id', classId)
        .order('day_of_week, start_time', { ascending: true });

      if (error) {
        logger.error('Error fetching timetable by class:', error);
        throw new CustomError('Failed to fetch timetable by class', 500);
      }

      // Group by day of week
      const groupedTimetable = data?.reduce((acc: any, entry) => {
        const day = entry.day_of_week;
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(entry);
        return acc;
      }, {}) || {};

      return groupedTimetable;
    } catch (error) {
      logger.error('TimetableService.getTimetableByClass error:', error);
      throw error;
    }
  }

  static async getTimetableByTeacher(teacherId: number) {
    try {
      const { data, error } = await supabase
        .from('timetable')
        .select(`
          *,
          classes:class_id (
            id,
            name,
            class_code
          ),
          subjects:subject_id (
            id,
            name,
            subject_code
          )
        `)
        .eq('teacher_id', teacherId)
        .order('day_of_week, start_time', { ascending: true });

      if (error) {
        logger.error('Error fetching timetable by teacher:', error);
        throw new CustomError('Failed to fetch timetable by teacher', 500);
      }

      // Group by day of week
      const groupedTimetable = data?.reduce((acc: any, entry) => {
        const day = entry.day_of_week;
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(entry);
        return acc;
      }, {}) || {};

      return groupedTimetable;
    } catch (error) {
      logger.error('TimetableService.getTimetableByTeacher error:', error);
      throw error;
    }
  }

  static async getTimetableByDay(dayOfWeek: string, classId?: number, teacherId?: number) {
    try {
      let query = supabase
        .from('timetable')
        .select(`
          *,
          classes:class_id (
            id,
            name,
            class_code
          ),
          subjects:subject_id (
            id,
            name,
            subject_code
          ),
          teachers:teacher_id (
            id,
            name,
            email
          )
        `)
        .eq('day_of_week', dayOfWeek);

      if (classId) {
        query = query.eq('class_id', classId);
      }
      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }

      const { data, error } = await query.order('start_time', { ascending: true });

      if (error) {
        logger.error('Error fetching timetable by day:', error);
        throw new CustomError('Failed to fetch timetable by day', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('TimetableService.getTimetableByDay error:', error);
      throw error;
    }
  }

  static async deleteTimetableEntry(id: number) {
    try {
      const { error } = await supabase
        .from('timetable')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Error deleting timetable entry:', error);
        throw new CustomError('Failed to delete timetable entry', 500);
      }

      return true;
    } catch (error) {
      logger.error('TimetableService.deleteTimetableEntry error:', error);
      throw error;
    }
  }

  static async getTimetableConflicts(entryData: any) {
    try {
      const { data, error } = await supabase
        .from('timetable')
        .select('*')
        .eq('day_of_week', entryData.day_of_week)
        .or(`and(class_id.eq.${entryData.class_id},start_time.lt.${entryData.end_time},end_time.gt.${entryData.start_time}),and(teacher_id.eq.${entryData.teacher_id},start_time.lt.${entryData.end_time},end_time.gt.${entryData.start_time})`);

      if (error) {
        logger.error('Error checking timetable conflicts:', error);
        throw new CustomError('Failed to check timetable conflicts', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('TimetableService.getTimetableConflicts error:', error);
      throw error;
    }
  }

  static async getTimetableStats(filters: any = {}) {
    try {
      // Get total timetable entries count
      const totalEntries = await this.getTimetableEntryCount(filters);

      // Get entries by day of week
      const { data: entriesByDay, error: dayError } = await supabase
        .from('timetable')
        .select('day_of_week')
        .not('day_of_week', 'is', null);

      if (dayError) {
        logger.error('Error fetching entries by day:', dayError);
        throw new CustomError('Failed to fetch timetable statistics', 500);
      }

      // Count entries per day
      const dayCounts = entriesByDay?.reduce((acc: any, entry) => {
        const day = entry.day_of_week || 'Unknown';
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {}) || {};

      // Get entries by subject
      const { data: entriesBySubject, error: subjectError } = await supabase
        .from('timetable')
        .select('subject_id, subjects:subject_id(name)')
        .not('subject_id', 'is', null);

      if (subjectError) {
        logger.error('Error fetching entries by subject:', subjectError);
        throw new CustomError('Failed to fetch timetable statistics', 500);
      }

      // Count entries per subject
      const subjectCounts = entriesBySubject?.reduce((acc: any, entry) => {
        const subjectName = entry.subjects?.name || 'Unknown Subject';
        acc[subjectName] = (acc[subjectName] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        totalEntries,
        dayCounts,
        subjectCounts,
        period: 'Current'
      };
    } catch (error) {
      logger.error('TimetableService.getTimetableStats error:', error);
      throw error;
    }
  }

  static async getWeeklyTimetable(classId?: number, teacherId?: number) {
    try {
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const weeklyTimetable: any = {};

      for (const day of daysOfWeek) {
        const dayTimetable = await this.getTimetableByDay(day, classId, teacherId);
        weeklyTimetable[day] = dayTimetable;
      }

      return weeklyTimetable;
    } catch (error) {
      logger.error('TimetableService.getWeeklyTimetable error:', error);
      throw error;
    }
  }
}
