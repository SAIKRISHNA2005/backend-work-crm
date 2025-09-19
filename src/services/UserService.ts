import { DatabaseService } from "./database";
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
    role: 'student' | 'teacher' | 'admin' | 'super_admin';
  }) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, config.security.bcryptRounds);

      const user = await DatabaseService.create('users', {
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        password_hash: hashedPassword,
        role: userData.role,
        status: 'active',
      });

      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username: string) {
    try {
      return await DatabaseService.findByField('users', 'username', username);
    } catch (error) {
      logger.error('Error finding user by username:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email: string) {
    try {
      return await DatabaseService.findByField('users', 'email', email);
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id: number) {
    try {
      return await DatabaseService.findById('users', id);
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(id: number, updateData: {
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: 'student' | 'teacher' | 'admin' | 'super_admin';
    status?: string;
  }) {
    try {
      const updateFields: any = { ...updateData };

      // Hash password if provided
      if (updateData.password) {
        updateFields.password_hash = await bcrypt.hash(updateData.password, config.security.bcryptRounds);
        delete updateFields.password;
      }

      return await DatabaseService.update('users', id, updateFields);
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      logger.error('Error verifying password:', error);
      throw error;
    }
  }

  // Get all users with pagination
  static async getAllUsers(options?: {
    limit?: number;
    offset?: number;
    role?: string;
    status?: string;
  }) {
    try {
      const filters: Record<string, any> = {};
      if (options?.role) filters.role = options.role;
      if (options?.status) filters.status = options.status;

      return await DatabaseService.findAll('users', {
        ...options,
        filters,
        orderBy: 'created_at',
        orderDirection: 'desc',
      });
    } catch (error) {
      logger.error('Error getting all users:', error);
      throw error;
    }
  }

  // Search users
  static async searchUsers(searchTerm: string, options?: {
    limit?: number;
    offset?: number;
  }) {
    try {
      return await DatabaseService.search('users', searchTerm, ['username', 'email'], {
        ...options,
        orderBy: 'created_at',
        orderDirection: 'desc',
      });
    } catch (error) {
      logger.error('Error searching users:', error);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(id: number) {
    try {
      return await DatabaseService.delete('users', id);
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get user count
  static async getUserCount(filters?: { role?: string; status?: string }) {
    try {
      return await DatabaseService.count('users', filters);
    } catch (error) {
      logger.error('Error getting user count:', error);
      throw error;
    }
  }
}
