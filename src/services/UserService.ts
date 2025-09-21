import { supabase } from "../config/database";
import { logger } from "../utils/logger";
import bcrypt from "bcryptjs";
import { config } from "../config/environment";

export class UserService {
  // Create a new user
  static async createUser(userData: {
    username: string;
    email?: string;
    phone?: string;
    password: string;
    role: string;
  }) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, config.security.bcryptRounds);

      const { data: user, error } = await supabase
        .from('users')
        .insert({
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          password_hash: hashedPassword,
          role: userData.role,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating user:', error);
        throw error;
      }

      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        logger.error('Error finding user by username:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error finding user by username:', error);
      return null;
    }
  }

  // Find user by email
  static async findByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        logger.error('Error finding user by email:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      return null;
    }
  }

  // Find user by ID
  static async findById(id: number) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error finding user by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      logger.error('Error verifying password:', error);
      return false;
    }
  }

  // Update user
  static async updateUser(id: number, updateData: {
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: string;
    status?: string;
  }) {
    try {
      const updateFields: any = { ...updateData };
      
      // Hash password if provided
      if (updateData.password) {
        updateFields.password_hash = await bcrypt.hash(updateData.password, config.security.bcryptRounds);
        delete updateFields.password;
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateFields)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating user:', error);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  // Get all users
  static async getAllUsers(options?: {
    limit?: number;
    offset?: number;
    role?: string;
  }) {
    try {
      let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.role) {
        query = query.eq('role', options.role);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error getting all users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting all users:', error);
      return [];
    }
  }

  // Search users
  static async searchUsers(searchTerm: string, options?: {
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('users')
        .select('*')
        .or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error searching users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error searching users:', error);
      return [];
    }
  }

  // Delete user
  static async deleteUser(id: number) {
    try {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error deleting user:', error);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get user count
  static async getUserCount(filters?: { role?: string }) {
    try {
      let query = supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (filters?.role) {
        query = query.eq('role', filters.role);
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Error getting user count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      logger.error('Error getting user count:', error);
      return 0;
    }
  }
}