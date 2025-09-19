import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { StudentService } from "../services/StudentService";
import { TeacherService } from "../services/TeacherService";
import { generateToken } from "../middleware/auth";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import { ApiResponse } from "../types";

export class AuthController {
  // User login
  static async login(req: Request, res: Response) {
    try {
      const { accId, password, role } = req.body;

      if (!accId || !password || !role) {
        throw new CustomError("Account ID, password and role are required", 400);
      }

      // Find user by username (accId)
      const user = await UserService.findByUsername(accId);
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      // Verify role
      if (user.role !== role) {
        throw new CustomError("Invalid role for this account", 403);
      }

      // Verify password
      const isPasswordValid = await UserService.verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        throw new CustomError("Invalid credentials", 401);
      }

      // Check if user is active
      if (user.status !== 'active') {
        throw new CustomError("Account is inactive", 403);
      }

      // Generate JWT token
      const token = generateToken(user.id.toString(), user.role);

      // Get user profile based on role
      let profile = null;
      if (role === 'student') {
        profile = await StudentService.findByUserId(user.id);
      } else if (role === 'teacher') {
        profile = await TeacherService.findByUserId(user.id);
      }

      // Set cookie for persistence
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const response: ApiResponse = {
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            profile: profile
          }
        }
      };

      logger.info(`User ${user.username} logged in successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Login error:", error);
      throw error;
    }
  }

  // User registration
  static async register(req: Request, res: Response) {
    try {
      const { username, email, phone, password, role, profileData } = req.body;

      if (!username || !password || !role) {
        throw new CustomError("Username, password and role are required", 400);
      }

      // Check if username already exists
      const existingUser = await UserService.findByUsername(username);
      if (existingUser) {
        throw new CustomError("Username already exists", 409);
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEmail = await UserService.findByEmail(email);
        if (existingEmail) {
          throw new CustomError("Email already exists", 409);
        }
      }

      // Create user
      const user = await UserService.createUser({
        username,
        email,
        phone,
        password,
        role
      });

      // Create profile based on role
      let profile = null;
      if (role === 'student' && profileData) {
        profile = await StudentService.createStudent({
          user_id: user.id,
          ...profileData
        });
      } else if (role === 'teacher' && profileData) {
        profile = await TeacherService.createTeacher({
          user_id: user.id,
          ...profileData
        });
      }

      // Generate JWT token
      const token = generateToken(user.id.toString(), user.role);

      const response: ApiResponse = {
        success: true,
        message: "Registration successful",
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            profile: profile
          }
        }
      };

      logger.info(`User ${user.username} registered successfully`);
      res.status(201).json(response);
    } catch (error) {
      logger.error("Registration error:", error);
      throw error;
    }
  }

  // Get current user profile
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;

      // Get user details
      const user = await UserService.findById(userId);
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      // Get profile based on role
      let profile = null;
      if (userRole === 'student') {
        profile = await StudentService.getStudentWithUser(userId);
      } else if (userRole === 'teacher') {
        profile = await TeacherService.getTeacherWithUser(userId);
      }

      const response: ApiResponse = {
        success: true,
        message: "Profile retrieved successfully",
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            created_at: user.created_at
          },
          profile: profile
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get profile error:", error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;
      const updateData = req.body;

      // Update user basic info
      const userUpdateData: any = {};
      if (updateData.email) userUpdateData.email = updateData.email;
      if (updateData.phone) userUpdateData.phone = updateData.phone;

      if (Object.keys(userUpdateData).length > 0) {
        await UserService.updateUser(userId, userUpdateData);
      }

      // Update profile based on role
      let profile = null;
      if (userRole === 'student') {
        const studentProfile = await StudentService.findByUserId(userId);
        if (studentProfile) {
          profile = await StudentService.updateStudent(studentProfile.id, updateData);
        }
      } else if (userRole === 'teacher') {
        const teacherProfile = await TeacherService.findByUserId(userId);
        if (teacherProfile) {
          profile = await TeacherService.updateTeacher(teacherProfile.id, updateData);
        }
      }

      const response: ApiResponse = {
        success: true,
        message: "Profile updated successfully",
        data: { profile }
      };

      logger.info(`User ${userId} profile updated successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Update profile error:", error);
      throw error;
    }
  }

  // Change password
  static async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new CustomError("Current password and new password are required", 400);
      }

      // Get user
      const user = await UserService.findById(userId);
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      // Verify current password
      const isCurrentPasswordValid = await UserService.verifyPassword(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        throw new CustomError("Current password is incorrect", 401);
      }

      // Update password
      await UserService.updateUser(userId, { password: newPassword });

      const response: ApiResponse = {
        success: true,
        message: "Password changed successfully"
      };

      logger.info(`User ${userId} changed password successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Change password error:", error);
      throw error;
    }
  }

  // Logout
  static async logout(req: Request, res: Response) {
    try {
      // Clear the cookie
      res.clearCookie("token");

      const response: ApiResponse = {
        success: true,
        message: "Logout successful"
      };

      logger.info(`User ${(req as any).user.id} logged out successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Logout error:", error);
      throw error;
    }
  }

  // Verify token
  static async verifyToken(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const response: ApiResponse = {
        success: true,
        message: "Token is valid",
        data: {
          user: {
            id: user.id,
            role: user.role
          }
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Verify token error:", error);
      throw error;
    }
  }
}
