import { supabase } from '../config/database';
import { CustomError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class NoteService {

  static async getAllNotes(filters: any = {}, pagination: { limit: number; offset: number } = { limit: 10, offset: 0 }) {
    try {
      let query = supabase
        .from('teacher_notes')
        .select(`
          *,
          teachers:teacher_id (
            id,
            name,
            email
          ),
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
        `);

      // Apply filters
      if (filters.teacher_id) {
        query = query.eq('teacher_id', filters.teacher_id);
      }
      if (filters.class_id) {
        query = query.eq('class_id', filters.class_id);
      }
      if (filters.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }
      if (filters.is_published !== undefined) {
        query = query.eq('is_published', filters.is_published);
      }

      // Apply pagination
      query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching notes:', error);
        throw new CustomError('Failed to fetch notes', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('NoteService.getAllNotes error:', error);
      throw error;
    }
  }

  static async getNoteCount(filters: any = {}) {
    try {
      let query = supabase
        .from('teacher_notes')
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters.teacher_id) {
        query = query.eq('teacher_id', filters.teacher_id);
      }
      if (filters.class_id) {
        query = query.eq('class_id', filters.class_id);
      }
      if (filters.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }
      if (filters.is_published !== undefined) {
        query = query.eq('is_published', filters.is_published);
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Error counting notes:', error);
        throw new CustomError('Failed to count notes', 500);
      }

      return count || 0;
    } catch (error) {
      logger.error('NoteService.getNoteCount error:', error);
      throw error;
    }
  }

  static async getNoteById(id: number) {
    try {
      const { data, error } = await supabase
        .from('teacher_notes')
        .select(`
          *,
          teachers:teacher_id (
            id,
            name,
            email
          ),
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
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error fetching note by ID:', error);
        throw new CustomError('Failed to fetch note', 500);
      }

      return data;
    } catch (error) {
      logger.error('NoteService.getNoteById error:', error);
      throw error;
    }
  }

  static async createNote(noteData: any) {
    try {
      const recordData = {
        ...noteData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('teacher_notes')
        .insert([recordData])
        .select(`
          *,
          teachers:teacher_id (
            id,
            name,
            email
          ),
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
        .single();

      if (error) {
        logger.error('Error creating note:', error);
        throw new CustomError('Failed to create note', 500);
      }

      return data;
    } catch (error) {
      logger.error('NoteService.createNote error:', error);
      throw error;
    }
  }

  static async updateNote(id: number, updateData: any) {
    try {
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('teacher_notes')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          teachers:teacher_id (
            id,
            name,
            email
          ),
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
        .single();

      if (error) {
        logger.error('Error updating note:', error);
        throw new CustomError('Failed to update note', 500);
      }

      return data;
    } catch (error) {
      logger.error('NoteService.updateNote error:', error);
      throw error;
    }
  }

  static async getNotesByTeacher(teacherId: number) {
    try {
      const { data, error } = await supabase
        .from('teacher_notes')
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
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching notes by teacher:', error);
        throw new CustomError('Failed to fetch notes by teacher', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('NoteService.getNotesByTeacher error:', error);
      throw error;
    }
  }

  static async getNotesByClass(classId: number) {
    try {
      const { data, error } = await supabase
        .from('teacher_notes')
        .select(`
          *,
          teachers:teacher_id (
            id,
            name,
            email
          ),
          subjects:subject_id (
            id,
            name,
            subject_code
          )
        `)
        .eq('class_id', classId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching notes by class:', error);
        throw new CustomError('Failed to fetch notes by class', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('NoteService.getNotesByClass error:', error);
      throw error;
    }
  }

  static async getPublishedNotes(filters: any = {}, pagination: { limit: number; offset: number } = { limit: 10, offset: 0 }) {
    try {
      let query = supabase
        .from('teacher_notes')
        .select(`
          *,
          teachers:teacher_id (
            id,
            name,
            email
          ),
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
        .eq('is_published', true);

      // Apply filters
      if (filters.class_id) {
        query = query.eq('class_id', filters.class_id);
      }
      if (filters.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }
      if (filters.teacher_id) {
        query = query.eq('teacher_id', filters.teacher_id);
      }

      // Apply pagination
      query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching published notes:', error);
        throw new CustomError('Failed to fetch published notes', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('NoteService.getPublishedNotes error:', error);
      throw error;
    }
  }

  static async toggleNotePublish(id: number) {
    try {
      // First get the current note to toggle its publish status
      const { data: currentNote, error: fetchError } = await supabase
        .from('teacher_notes')
        .select('is_published')
        .eq('id', id)
        .single();

      if (fetchError) {
        logger.error('Error fetching note for toggle:', fetchError);
        throw new CustomError('Failed to fetch note', 500);
      }

      const newPublishStatus = !currentNote.is_published;

      const { data, error } = await supabase
        .from('teacher_notes')
        .update({ 
          is_published: newPublishStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          teachers:teacher_id (
            id,
            name,
            email
          ),
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
        .single();

      if (error) {
        logger.error('Error toggling note publish status:', error);
        throw new CustomError('Failed to toggle note publish status', 500);
      }

      return data;
    } catch (error) {
      logger.error('NoteService.toggleNotePublish error:', error);
      throw error;
    }
  }

  static async getNoteStats(filters: any = {}) {
    try {
      // Get total note count
      const totalNotes = await this.getNoteCount(filters);

      // Get published vs unpublished count
      const { data: publishedCount, error: publishedError } = await supabase
        .from('teacher_notes')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      if (publishedError) {
        logger.error('Error counting published notes:', publishedError);
        throw new CustomError('Failed to fetch note statistics', 500);
      }

      const { data: unpublishedCount, error: unpublishedError } = await supabase
        .from('teacher_notes')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', false);

      if (unpublishedError) {
        logger.error('Error counting unpublished notes:', unpublishedError);
        throw new CustomError('Failed to fetch note statistics', 500);
      }

      // Get notes by teacher
      const { data: notesByTeacher, error: teacherError } = await supabase
        .from('teacher_notes')
        .select('teacher_id, teachers:teacher_id(name)')
        .not('teacher_id', 'is', null);

      if (teacherError) {
        logger.error('Error fetching notes by teacher:', teacherError);
        throw new CustomError('Failed to fetch note statistics', 500);
      }

      // Count notes per teacher
      const teacherNoteCounts = notesByTeacher?.reduce((acc: any, note) => {
        const teacherName = note.teachers?.name || 'Unknown Teacher';
        acc[teacherName] = (acc[teacherName] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        totalNotes,
        publishedNotes: publishedCount || 0,
        unpublishedNotes: unpublishedCount || 0,
        teacherNoteCounts,
        period: 'All time'
      };
    } catch (error) {
      logger.error('NoteService.getNoteStats error:', error);
      throw error;
    }
  }

  static async deleteNote(id: number) {
    try {
      const { error } = await supabase
        .from('teacher_notes')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Error deleting note:', error);
        throw new CustomError('Failed to delete note', 500);
      }

      return true;
    } catch (error) {
      logger.error('NoteService.deleteNote error:', error);
      throw error;
    }
  }

  static async searchNotes(searchTerm: string, filters: any = {}) {
    try {
      let query = supabase
        .from('teacher_notes')
        .select(`
          *,
          teachers:teacher_id (
            id,
            name,
            email
          ),
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
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);

      // Apply filters
      if (filters.teacher_id) {
        query = query.eq('teacher_id', filters.teacher_id);
      }
      if (filters.class_id) {
        query = query.eq('class_id', filters.class_id);
      }
      if (filters.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }
      if (filters.is_published !== undefined) {
        query = query.eq('is_published', filters.is_published);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        logger.error('Error searching notes:', error);
        throw new CustomError('Failed to search notes', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('NoteService.searchNotes error:', error);
      throw error;
    }
  }
}
