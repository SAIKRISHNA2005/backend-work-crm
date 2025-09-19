import { Request, Response } from "express";
import { StudentService } from "../services/StudentService";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import { ApiResponse, PaginationParams } from "../types";

export class StudentController {
  // Get student profile
  static async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const studentId = parseInt(id);

      if (isNaN(studentId)) {
        throw new CustomError("Invalid student ID", 400);
      }

      const student = await StudentService.getStudentWithUser(studentId);
      if (!student) {
        throw new CustomError("Student not found", 404);
      }

      const response: ApiResponse = {
        success: true,
        message: "Student profile retrieved successfully",
        data: { student }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get student profile error:", error);
      throw error;
    }
  }

  // Update student profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const studentId = parseInt(id);
      const updateData = req.body;

      if (isNaN(studentId)) {
        throw new CustomError("Invalid student ID", 400);
      }

      const student = await StudentService.findById(studentId);
      if (!student) {
        throw new CustomError("Student not found", 404);
      }

      const updatedStudent = await StudentService.updateStudent(studentId, updateData);

      const response: ApiResponse = {
        success: true,
        message: "Student profile updated successfully",
        data: { student: updatedStudent }
      };

      logger.info(`Student ${studentId} profile updated successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Update student profile error:", error);
      throw error;
    }
  }

  // Create new student
  static async createStudent(req: Request, res: Response) {
    try {
      const studentData = req.body;

      const student = await StudentService.createStudent(studentData);

      const response: ApiResponse = {
        success: true,
        message: "Student created successfully",
        data: { student }
      };

      logger.info(`Student created successfully with ID: ${student.id}`);
      res.status(201).json(response);
    } catch (error) {
      logger.error("Create student error:", error);
      throw error;
    }
  }

  // Get all students with pagination
  static async getAllStudents(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, class_id, school_id } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const options: any = {
        limit: limitNum,
        offset: offset,
        orderBy: 'name',
        orderDirection: 'asc' as const
      };

      if (class_id) options.class_id = parseInt(class_id as string);
      if (school_id) options.school_id = parseInt(school_id as string);

      const students = await StudentService.getAllStudents(options);
      const totalCount = await StudentService.getStudentCount({
        class_id: options.class_id,
        school_id: options.school_id
      });

      const response: ApiResponse = {
        success: true,
        message: "Students retrieved successfully",
        data: { students },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get all students error:", error);
      throw error;
    }
  }

  // Search students
  static async searchStudents(req: Request, res: Response) {
    try {
      const { q, limit = 50, class_id, school_id } = req.query;

      if (!q) {
        throw new CustomError("Search query is required", 400);
      }

      const options: any = {
        limit: parseInt(limit as string)
      };

      if (class_id) options.class_id = parseInt(class_id as string);
      if (school_id) options.school_id = parseInt(school_id as string);

      const students = await StudentService.searchStudents(q as string, options);

      const response: ApiResponse = {
        success: true,
        message: "Student search completed successfully",
        data: { students }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Search students error:", error);
      throw error;
    }
  }

  // Get students by class
  static async getStudentsByClass(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const classIdNum = parseInt(classId);
      if (isNaN(classIdNum)) {
        throw new CustomError("Invalid class ID", 400);
      }

      const students = await StudentService.getStudentsByClass(classIdNum, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });

      const response: ApiResponse = {
        success: true,
        message: "Students by class retrieved successfully",
        data: { students }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get students by class error:", error);
      throw error;
    }
  }

  // Get students by school
  static async getStudentsBySchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const schoolIdNum = parseInt(schoolId);
      if (isNaN(schoolIdNum)) {
        throw new CustomError("Invalid school ID", 400);
      }

      const students = await StudentService.getStudentsBySchool(schoolIdNum, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });

      const response: ApiResponse = {
        success: true,
        message: "Students by school retrieved successfully",
        data: { students }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get students by school error:", error);
      throw error;
    }
  }

  // Get student statistics
  static async getStudentStats(req: Request, res: Response) {
    try {
      const { class_id, school_id } = req.query;

      const filters: any = {};
      if (class_id) filters.class_id = parseInt(class_id as string);
      if (school_id) filters.school_id = parseInt(school_id as string);

      const totalStudents = await StudentService.getStudentCount(filters);

      const response: ApiResponse = {
        success: true,
        message: "Student statistics retrieved successfully",
        data: {
          totalStudents,
          filters
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get student statistics error:", error);
      throw error;
    }
  }

  // Get student count
  static async getStudentCount(req: Request, res: Response) {
    try {
      const { class_id, school_id } = req.query;

      const filters: any = {};
      if (class_id) filters.class_id = parseInt(class_id as string);
      if (school_id) filters.school_id = parseInt(school_id as string);

      const count = await StudentService.getStudentCount(filters);

      const response: ApiResponse = {
        success: true,
        message: "Student count retrieved successfully",
        data: { count }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get student count error:", error);
      throw error;
    }
  }

  // Delete student
  static async deleteStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const studentId = parseInt(id);

      if (isNaN(studentId)) {
        throw new CustomError("Invalid student ID", 400);
      }

      const student = await StudentService.findById(studentId);
      if (!student) {
        throw new CustomError("Student not found", 404);
      }

      await StudentService.deleteStudent(studentId);

      const response: ApiResponse = {
        success: true,
        message: "Student deleted successfully"
      };

      logger.info(`Student ${studentId} deleted successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Delete student error:", error);
      throw error;
    }
  }
}
