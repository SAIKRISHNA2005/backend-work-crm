import { DatabaseService } from "./database";
import { supabase } from "../config/database";
import { logger } from "../utils/logger";

export class StudentService {
  // Create a new student profile
  static async createStudent(studentData: {
    user_id: number;
    school_id: number;
    class_id: number;
    roll_number?: string;
    name: string;
    father_name?: string;
    mother_name?: string;
    father_occupation?: string;
    mother_occupation?: string;
    blood_group?: string;
    father_contact?: string;
    mother_contact?: string;
    aadhar_number?: string;
    bio?: string;
    superpowers?: string;
    current_mission?: string;
    side_quests?: string;
    joined_on?: string;
    address?: string;
    location?: string;
    fee_payment_status?: string;
    event_registration_info?: string;
    classwise_leaderboard_rank?: number;
    overall_leaderboard_rank?: number;
    active_courses?: string;
  }) {
    try {
      return await DatabaseService.create('student_profiles', studentData);
    } catch (error) {
      logger.error('Error creating student:', error);
      throw error;
    }
  }

  // Find student by ID
  static async findById(id: number) {
    try {
      return await DatabaseService.findById('student_profiles', id);
    } catch (error) {
      logger.error('Error finding student by ID:', error);
      throw error;
    }
  }

  // Find student by user ID
  static async findByUserId(userId: number) {
    try {
      return await DatabaseService.findByField('student_profiles', 'user_id', userId);
    } catch (error) {
      logger.error('Error finding student by user ID:', error);
      throw error;
    }
  }

  // Find student by roll number
  static async findByRollNumber(rollNumber: string) {
    try {
      return await DatabaseService.findByField('student_profiles', 'roll_number', rollNumber);
    } catch (error) {
      logger.error('Error finding student by roll number:', error);
      throw error;
    }
  }

  // Get students by class
  static async getStudentsByClass(classId: number, options?: {
    limit?: number;
    offset?: number;
  }) {
    try {
      return await DatabaseService.findManyByField('student_profiles', 'class_id', classId, {
        ...options,
        orderBy: 'roll_number',
        orderDirection: 'asc',
      });
    } catch (error) {
      logger.error('Error getting students by class:', error);
      throw error;
    }
  }

  // Get students by school
  static async getStudentsBySchool(schoolId: number, options?: {
    limit?: number;
    offset?: number;
  }) {
    try {
      return await DatabaseService.findManyByField('student_profiles', 'school_id', schoolId, {
        ...options,
        orderBy: 'name',
        orderDirection: 'asc',
      });
    } catch (error) {
      logger.error('Error getting students by school:', error);
      throw error;
    }
  }

  // Update student
  static async updateStudent(id: number, updateData: {
    roll_number?: string;
    name?: string;
    father_name?: string;
    mother_name?: string;
    father_occupation?: string;
    mother_occupation?: string;
    blood_group?: string;
    father_contact?: string;
    mother_contact?: string;
    aadhar_number?: string;
    bio?: string;
    superpowers?: string;
    current_mission?: string;
    side_quests?: string;
    joined_on?: string;
    address?: string;
    location?: string;
    fee_payment_status?: string;
    event_registration_info?: string;
    classwise_leaderboard_rank?: number;
    overall_leaderboard_rank?: number;
    active_courses?: string;
  }) {
    try {
      return await DatabaseService.update('student_profiles', id, updateData);
    } catch (error) {
      logger.error('Error updating student:', error);
      throw error;
    }
  }

  // Get all students with pagination
  static async getAllStudents(options?: {
    limit?: number;
    offset?: number;
    class_id?: number;
    school_id?: number;
  }) {
    try {
      const filters: Record<string, any> = {};
      if (options?.class_id) filters.class_id = options.class_id;
      if (options?.school_id) filters.school_id = options.school_id;

      return await DatabaseService.findAll('student_profiles', {
        ...options,
        filters,
        orderBy: 'name',
        orderDirection: 'asc',
      });
    } catch (error) {
      logger.error('Error getting all students:', error);
      throw error;
    }
  }

  // Search students
  static async searchStudents(searchTerm: string, options?: {
    limit?: number;
    offset?: number;
    class_id?: number;
    school_id?: number;
  }) {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select(`
          *,
          users!inner(username, email, phone, role, status)
        `)
        .or(`name.ilike.%${searchTerm}%,roll_number.ilike.%${searchTerm}%,father_name.ilike.%${searchTerm}%,mother_name.ilike.%${searchTerm}%`)
        .order('name', { ascending: true })
        .limit(options?.limit || 50);

      if (error) {
        logger.error('Error searching students:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Error searching students:', error);
      throw error;
    }
  }

  // Delete student
  static async deleteStudent(id: number) {
    try {
      return await DatabaseService.delete('student_profiles', id);
    } catch (error) {
      logger.error('Error deleting student:', error);
      throw error;
    }
  }

  // Get student count
  static async getStudentCount(filters?: { class_id?: number; school_id?: number }) {
    try {
      return await DatabaseService.count('student_profiles', filters);
    } catch (error) {
      logger.error('Error getting student count:', error);
      throw error;
    }
  }

  // Get student with user details
  static async getStudentWithUser(id: number) {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select(`
          *,
          users!inner(username, email, phone, role, status),
          classes(name, section, room_number),
          schools(name, address, location)
        `)
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error getting student with user details:', error);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error getting student with user details:', error);
      throw error;
    }
  }

  // Update student leaderboard ranks
  static async updateLeaderboardRanks(classId: number) {
    try {
      // Get all students in the class ordered by overall performance
      const { data: students, error } = await supabase
        .from('student_profiles')
        .select('id, classwise_leaderboard_rank')
        .eq('class_id', classId)
        .order('classwise_leaderboard_rank', { ascending: true, nullsLast: true });

      if (error) {
        logger.error('Error getting students for leaderboard update:', error);
        throw error;
      }

      // Update ranks
      const updatePromises = students?.map((student, index) => 
        DatabaseService.update('student_profiles', student.id, {
          classwise_leaderboard_rank: index + 1
        })
      ) || [];

      await Promise.all(updatePromises);
      
      return true;
    } catch (error) {
      logger.error('Error updating leaderboard ranks:', error);
      throw error;
    }
  }
}
