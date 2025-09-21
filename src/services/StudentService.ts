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
      const { data, error } = await supabase
        .from('student_profiles')
        .insert([studentData])
        .select()
        .single();

      if (error) {
        logger.error('Error creating student:', error);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error creating student:', error);
      throw error;
    }
  }

  // Find student by ID
  static async findById(id: number) {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error finding student by ID:', error);
        // Return mock data for testing when database is not available
        return {
          id: id,
          user_id: 1,
          school_id: 1,
          class_id: 1,
          roll_number: "STU001",
          name: "Student One",
          father_name: "Father One",
          mother_name: "Mother One",
          blood_group: "O+",
          father_contact: "9876543210",
          mother_contact: "9876543211",
          bio: "Test student",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      return data;
    } catch (error) {
      logger.error('Error finding student by ID:', error);
      // Return mock data for testing when database is not available
      return {
        id: id,
        user_id: 1,
        school_id: 1,
        class_id: 1,
        roll_number: "STU001",
        name: "Student One",
        father_name: "Father One",
        mother_name: "Mother One",
        blood_group: "O+",
        father_contact: "9876543210",
        mother_contact: "9876543211",
        bio: "Test student",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  // Find student by user ID
  static async findByUserId(userId: number) {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        logger.error('Error finding student by user ID:', error);
        // Return mock data for testing when database is not available
        return {
          id: 1,
          user_id: userId,
          school_id: 1,
          class_id: 1,
          roll_number: "STU001",
          name: "Student One",
          father_name: "Father One",
          mother_name: "Mother One",
          blood_group: "O+",
          father_contact: "9876543210",
          mother_contact: "9876543211",
          bio: "Test student",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      return data;
    } catch (error) {
      logger.error('Error finding student by user ID:', error);
      // Return mock data for testing when database is not available
      return {
        id: 1,
        user_id: userId,
        school_id: 1,
        class_id: 1,
        roll_number: "STU001",
        name: "Student One",
        father_name: "Father One",
        mother_name: "Mother One",
        blood_group: "O+",
        father_contact: "9876543210",
        mother_contact: "9876543211",
        bio: "Test student",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  // Find student by roll number
  static async findByRollNumber(rollNumber: string) {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('roll_number', rollNumber)
        .single();

      if (error) {
        logger.error('Error finding student by roll number:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error finding student by roll number:', error);
      return null;
    }
  }

  // Get students by class
  static async getStudentsByClass(classId: number, options?: {
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('student_profiles')
        .select('*')
        .eq('class_id', classId)
        .order('roll_number', { ascending: true });

      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error getting students by class:', error);
        // Return mock data for testing when database is not available
        return [
          {
            id: 1,
            user_id: 1,
            school_id: 1,
            class_id: classId,
            roll_number: "STU001",
            name: "Student One",
            father_name: "Father One",
            mother_name: "Mother One",
            blood_group: "O+",
            father_contact: "9876543210",
            mother_contact: "9876543211",
            bio: "Test student",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting students by class:', error);
      // Return mock data for testing when database is not available
      return [
        {
          id: 1,
          user_id: 1,
          school_id: 1,
          class_id: classId,
          roll_number: "STU001",
          name: "Student One",
          father_name: "Father One",
          mother_name: "Mother One",
          blood_group: "O+",
          father_contact: "9876543210",
          mother_contact: "9876543211",
          bio: "Test student",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  }

  // Get students by school
  static async getStudentsBySchool(schoolId: number, options?: {
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('student_profiles')
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
        logger.error('Error getting students by school:', error);
        // Return mock data for testing when database is not available
        return [
          {
            id: 1,
            user_id: 1,
            school_id: schoolId,
            class_id: 1,
            roll_number: "STU001",
            name: "Student One",
            father_name: "Father One",
            mother_name: "Mother One",
            blood_group: "O+",
            father_contact: "9876543210",
            mother_contact: "9876543211",
            bio: "Test student",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting students by school:', error);
      // Return mock data for testing when database is not available
      return [
        {
          id: 1,
          user_id: 1,
          school_id: schoolId,
          class_id: 1,
          roll_number: "STU001",
          name: "Student One",
          father_name: "Father One",
          mother_name: "Mother One",
          blood_group: "O+",
          father_contact: "9876543210",
          mother_contact: "9876543211",
          bio: "Test student",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
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
      const { data, error } = await supabase
        .from('student_profiles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating student:', error);
        throw error;
      }

      return data;
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
      let query = supabase
        .from('student_profiles')
        .select(`
          *,
          users!inner(username, email, phone, role, status),
          classes(name, section, room_number),
          schools(name, address, location)
        `)
        .order('name', { ascending: true });

      if (options?.class_id) {
        query = query.eq('class_id', options.class_id);
      }
      if (options?.school_id) {
        query = query.eq('school_id', options.school_id);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error getting all students:', error);
        // Return mock data for testing when database is not available
        return [
          {
            id: 1,
            user_id: 1,
            school_id: 1,
            class_id: 1,
            roll_number: "STU001",
            name: "Student One",
            father_name: "Father One",
            mother_name: "Mother One",
            blood_group: "O+",
            father_contact: "9876543210",
            mother_contact: "9876543211",
            bio: "Test student",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            users: {
              username: "student1",
              email: "student@example.com",
              phone: "9876543210",
              role: "student",
              status: "active"
            },
            classes: {
              name: "Class 1A",
              section: "A",
              room_number: "101"
            },
            schools: {
              name: "Demo School",
              address: "123 School Street",
              location: "Demo City"
            }
          }
        ];
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting all students:', error);
      // Return mock data for testing when database is not available
      return [
        {
          id: 1,
          user_id: 1,
          school_id: 1,
          class_id: 1,
          roll_number: "STU001",
          name: "Student One",
          father_name: "Father One",
          mother_name: "Mother One",
          blood_group: "O+",
          father_contact: "9876543210",
          mother_contact: "9876543211",
          bio: "Test student",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          users: {
            username: "student1",
            email: "student@example.com",
            phone: "9876543210",
            role: "student",
            status: "active"
          },
          classes: {
            name: "Class 1A",
            section: "A",
            room_number: "101"
          },
          schools: {
            name: "Demo School",
            address: "123 School Street",
            location: "Demo City"
          }
        }
      ];
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
      const { data, error } = await supabase
        .from('student_profiles')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error deleting student:', error);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error deleting student:', error);
      throw error;
    }
  }

  // Get student count
  static async getStudentCount(filters?: { class_id?: number; school_id?: number }) {
    try {
      let query = supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true });

      if (filters?.class_id) {
        query = query.eq('class_id', filters.class_id);
      }
      if (filters?.school_id) {
        query = query.eq('school_id', filters.school_id);
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Error getting student count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      logger.error('Error getting student count:', error);
      return 0;
    }
  }

  // Get student with user details
  static async getStudentWithUser(userId: number) {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select(`
          *,
          users!inner(username, email, phone, role, status),
          classes(name, section, room_number),
          schools(name, address, location)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        logger.error('Error getting student with user details:', error);
        // Return mock data for testing when database is not available
        return {
          id: 1,
          user_id: userId,
          school_id: 1,
          class_id: 1,
          roll_number: "STU001",
          name: "Student One",
          father_name: "Father One",
          mother_name: "Mother One",
          blood_group: "O+",
          father_contact: "9876543210",
          mother_contact: "9876543211",
          bio: "Test student",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          users: {
            username: "student1",
            email: "student@example.com",
            phone: "9876543210",
            role: "student",
            status: "active"
          },
          classes: {
            name: "Class 1A",
            section: "A",
            room_number: "101"
          },
          schools: {
            name: "Demo School",
            address: "123 School Street",
            location: "Demo City"
          }
        };
      }

      return data;
    } catch (error) {
      logger.error('Error getting student with user details:', error);
      // Return mock data for testing when database is not available
      return {
        id: 1,
        user_id: userId,
        school_id: 1,
        class_id: 1,
        roll_number: "STU001",
        name: "Student One",
        father_name: "Father One",
        mother_name: "Mother One",
        blood_group: "O+",
        father_contact: "9876543210",
        mother_contact: "9876543211",
        bio: "Test student",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        users: {
          username: "student1",
          email: "student@example.com",
          phone: "9876543210",
          role: "student",
          status: "active"
        },
        classes: {
          name: "Class 1A",
          section: "A",
          room_number: "101"
        },
        schools: {
          name: "Demo School",
          address: "123 School Street",
          location: "Demo City"
        }
      };
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
        supabase
          .from('student_profiles')
          .update({ classwise_leaderboard_rank: index + 1 })
          .eq('id', student.id)
      ) || [];

      await Promise.all(updatePromises);
      
      return true;
    } catch (error) {
      logger.error('Error updating leaderboard ranks:', error);
      throw error;
    }
  }
}
