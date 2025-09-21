import { supabase } from "../config/database";
import { logger } from "../utils/logger";

export class TeacherService {
  // Create a new teacher profile
  static async createTeacher(teacherData: {
    user_id: number;
    school_id: number;
    name: string;
    phone?: string;
    email?: string;
    blood_group?: string;
    address?: string;
    handling_classes?: string;
    home_class_id?: number;
    subjects_handled?: string;
    personal_attendance_percent?: number;
    leaves_count?: number;
    salary_status?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .insert([teacherData])
        .select()
        .single();

      if (error) {
        logger.error('Error creating teacher:', error);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error creating teacher:', error);
      throw error;
    }
  }

  // Find teacher by ID
  static async findById(id: number) {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error finding teacher by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error finding teacher by ID:', error);
      throw error;
    }
  }

  // Find teacher by user ID
  static async findByUserId(userId: number) {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        logger.error('Error finding teacher by user ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error finding teacher by user ID:', error);
      throw error;
    }
  }

  // Get teachers by school
  static async getTeachersBySchool(schoolId: number, options?: {
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('teacher_profiles')
        .select('*')
        .eq('school_id', schoolId)
        .order('name', { ascending: true });

      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error getting teachers by school:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting teachers by school:', error);
      throw error;
    }
  }

  // Get teachers by home class
  static async getTeachersByHomeClass(classId: number) {
    try {
      return await supabase.findManyByField('teacher_profiles', 'home_class_id', classId);
    } catch (error) {
      logger.error('Error getting teachers by home class:', error);
      throw error;
    }
  }

  // Update teacher
  static async updateTeacher(id: number, updateData: {
    name?: string;
    phone?: string;
    email?: string;
    blood_group?: string;
    address?: string;
    handling_classes?: string;
    home_class_id?: number;
    subjects_handled?: string;
    personal_attendance_percent?: number;
    leaves_count?: number;
    salary_status?: string;
  }) {
    try {
      return await supabase.update('teacher_profiles', id, updateData);
    } catch (error) {
      logger.error('Error updating teacher:', error);
      throw error;
    }
  }

  // Get all teachers with pagination
  static async getAllTeachers(options?: {
    limit?: number;
    offset?: number;
    school_id?: number;
  }) {
    try {
      const filters: Record<string, any> = {};
      if (options?.school_id) filters.school_id = options.school_id;

      return await supabase.findAll('teacher_profiles', {
        ...options,
        filters,
        orderBy: 'name',
        orderDirection: 'asc',
      });
    } catch (error) {
      logger.error('Error getting all teachers:', error);
      throw error;
    }
  }

  // Search teachers
  static async searchTeachers(searchTerm: string, options?: {
    limit?: number;
    offset?: number;
    school_id?: number;
  }) {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select(`
          *,
          users!inner(username, email, phone, role, status)
        `)
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .order('name', { ascending: true })
        .limit(options?.limit || 50);

      if (error) {
        logger.error('Error searching teachers:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Error searching teachers:', error);
      throw error;
    }
  }

  // Delete teacher
  static async deleteTeacher(id: number) {
    try {
      return await supabase.delete('teacher_profiles', id);
    } catch (error) {
      logger.error('Error deleting teacher:', error);
      throw error;
    }
  }

  // Get teacher count
  static async getTeacherCount(filters?: { school_id?: number }) {
    try {
      return await supabase.count('teacher_profiles', filters);
    } catch (error) {
      logger.error('Error getting teacher count:', error);
      throw error;
    }
  }

  // Get teacher with user details
  static async getTeacherWithUser(userId: number) {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select(`
          *,
          users!inner(username, email, phone, role, status),
          classes!teacher_profiles_home_class_id_fkey(name, section, room_number),
          schools(name, address, location)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        logger.error('Error getting teacher with user details:', error);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error getting teacher with user details:', error);
      throw error;
    }
  }

  // Get teachers handling specific subjects
  static async getTeachersBySubject(subjectName: string, schoolId?: number) {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*')
        .ilike('subjects_handled', `%${subjectName}%`)
        .order('name', { ascending: true });

      if (error) {
        logger.error('Error getting teachers by subject:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting teachers by subject:', error);
      throw error;
    }
  }

  // Update teacher attendance percentage
  static async updateAttendancePercentage(teacherId: number, percentage: number) {
    try {
      return await supabase.update('teacher_profiles', teacherId, {
        personal_attendance_percent: percentage
      });
    } catch (error) {
      logger.error('Error updating teacher attendance percentage:', error);
      throw error;
    }
  }

  // Update teacher leave count
  static async updateLeaveCount(teacherId: number, leaveCount: number) {
    try {
      return await supabase.update('teacher_profiles', teacherId, {
        leaves_count: leaveCount
      });
    } catch (error) {
      logger.error('Error updating teacher leave count:', error);
      throw error;
    }
  }

  // Get teacher statistics
  static async getTeacherStats(teacherId: number) {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select(`
          *,
          classes!teacher_profiles_home_class_id_fkey(
            id,
            name,
            section,
            student_profiles(count)
          )
        `)
        .eq('id', teacherId)
        .single();

      if (error) {
        logger.error('Error getting teacher statistics:', error);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error getting teacher statistics:', error);
      throw error;
    }
  }
}
