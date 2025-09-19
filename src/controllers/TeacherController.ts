import { Request, Response } from "express";
import { TeacherService } from "../services/TeacherService";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import { ApiResponse } from "../types";

export class TeacherController {
  // Get teacher profile
  static async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const teacherId = parseInt(id);

      if (isNaN(teacherId)) {
        throw new CustomError("Invalid teacher ID", 400);
      }

      const teacher = await TeacherService.getTeacherWithUser(teacherId);
      if (!teacher) {
        throw new CustomError("Teacher not found", 404);
      }

      const response: ApiResponse = {
        success: true,
        message: "Teacher profile retrieved successfully",
        data: { teacher }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get teacher profile error:", error);
      throw error;
    }
  }

  // Update teacher profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const teacherId = parseInt(id);
      const updateData = req.body;

      if (isNaN(teacherId)) {
        throw new CustomError("Invalid teacher ID", 400);
      }

      const teacher = await TeacherService.findById(teacherId);
      if (!teacher) {
        throw new CustomError("Teacher not found", 404);
      }

      const updatedTeacher = await TeacherService.updateTeacher(teacherId, updateData);

      const response: ApiResponse = {
        success: true,
        message: "Teacher profile updated successfully",
        data: { teacher: updatedTeacher }
      };

      logger.info(`Teacher ${teacherId} profile updated successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Update teacher profile error:", error);
      throw error;
    }
  }

  // Create new teacher
  static async createTeacher(req: Request, res: Response) {
    try {
      const teacherData = req.body;

      const teacher = await TeacherService.createTeacher(teacherData);

      const response: ApiResponse = {
        success: true,
        message: "Teacher created successfully",
        data: { teacher }
      };

      logger.info(`Teacher created successfully with ID: ${teacher.id}`);
      res.status(201).json(response);
    } catch (error) {
      logger.error("Create teacher error:", error);
      throw error;
    }
  }

  // Get all teachers with pagination
  static async getAllTeachers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, school_id } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const options: any = {
        limit: limitNum,
        offset: offset,
        orderBy: 'name',
        orderDirection: 'asc' as const
      };

      if (school_id) options.school_id = parseInt(school_id as string);

      const teachers = await TeacherService.getAllTeachers(options);
      const totalCount = await TeacherService.getTeacherCount({
        school_id: options.school_id
      });

      const response: ApiResponse = {
        success: true,
        message: "Teachers retrieved successfully",
        data: { teachers },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get all teachers error:", error);
      throw error;
    }
  }

  // Search teachers
  static async searchTeachers(req: Request, res: Response) {
    try {
      const { q, limit = 50, school_id } = req.query;

      if (!q) {
        throw new CustomError("Search query is required", 400);
      }

      const options: any = {
        limit: parseInt(limit as string)
      };

      if (school_id) options.school_id = parseInt(school_id as string);

      const teachers = await TeacherService.searchTeachers(q as string, options);

      const response: ApiResponse = {
        success: true,
        message: "Teacher search completed successfully",
        data: { teachers }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Search teachers error:", error);
      throw error;
    }
  }

  // Get teachers by school
  static async getTeachersBySchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const schoolIdNum = parseInt(schoolId);
      if (isNaN(schoolIdNum)) {
        throw new CustomError("Invalid school ID", 400);
      }

      const teachers = await TeacherService.getTeachersBySchool(schoolIdNum, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });

      const response: ApiResponse = {
        success: true,
        message: "Teachers by school retrieved successfully",
        data: { teachers }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get teachers by school error:", error);
      throw error;
    }
  }

  // Get teacher statistics
  static async getTeacherStats(req: Request, res: Response) {
    try {
      const { school_id } = req.query;

      const filters: any = {};
      if (school_id) filters.school_id = parseInt(school_id as string);

      const totalTeachers = await TeacherService.getTeacherCount(filters);

      const response: ApiResponse = {
        success: true,
        message: "Teacher statistics retrieved successfully",
        data: {
          totalTeachers,
          filters
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get teacher statistics error:", error);
      throw error;
    }
  }

  // Get teacher count
  static async getTeacherCount(req: Request, res: Response) {
    try {
      const { school_id } = req.query;

      const filters: any = {};
      if (school_id) filters.school_id = parseInt(school_id as string);

      const count = await TeacherService.getTeacherCount(filters);

      const response: ApiResponse = {
        success: true,
        message: "Teacher count retrieved successfully",
        data: { count }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get teacher count error:", error);
      throw error;
    }
  }

  // Delete teacher
  static async deleteTeacher(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const teacherId = parseInt(id);

      if (isNaN(teacherId)) {
        throw new CustomError("Invalid teacher ID", 400);
      }

      const teacher = await TeacherService.findById(teacherId);
      if (!teacher) {
        throw new CustomError("Teacher not found", 404);
      }

      await TeacherService.deleteTeacher(teacherId);

      const response: ApiResponse = {
        success: true,
        message: "Teacher deleted successfully"
      };

      logger.info(`Teacher ${teacherId} deleted successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Delete teacher error:", error);
      throw error;
    }
  }
}
