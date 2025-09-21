import { Request, Response } from "express";
import { ClassService } from "../services/ClassService";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import { ApiResponse } from "../types";

export class ClassController {
  // Get all classes
  static async getAllClasses(req: Request, res: Response) {
    try {
      const { page = 1, limit = 50, school_id } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const filters: Record<string, any> = {};
      if (school_id) filters.school_id = parseInt(school_id as string);

      const classes = await ClassService.getAllClasses(filters, {
        limit: limitNum,
        offset: offset,
        orderBy: 'name',
        orderDirection: 'asc'
      });

      const totalCount = await ClassService.getClassCount(filters);

      const response: ApiResponse = {
        success: true,
        message: "Classes retrieved successfully",
        data: { classes },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get all classes error:", error);
      throw error;
    }
  }

  // Get class by ID
  static async getClassById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const classId = parseInt(id);

      if (isNaN(classId)) {
        throw new CustomError("Invalid class ID", 400);
      }

      const classData = await ClassService.getClassById(classId);
      if (!classData) {
        throw new CustomError("Class not found", 404);
      }

      const response: ApiResponse = {
        success: true,
        message: "Class retrieved successfully",
        data: { class: classData }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get class by ID error:", error);
      throw error;
    }
  }

  // Create new class
  static async createClass(req: Request, res: Response) {
    try {
      const classData = req.body;

      const newClass = await ClassService.createClass(classData);

      const response: ApiResponse = {
        success: true,
        message: "Class created successfully",
        data: { class: newClass }
      };

      logger.info(`Class created successfully with ID: ${newClass.id}`);
      res.status(201).json(response);
    } catch (error) {
      logger.error("Create class error:", error);
      throw error;
    }
  }

  // Update class
  static async updateClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const classId = parseInt(id);
      const updateData = req.body;

      if (isNaN(classId)) {
        throw new CustomError("Invalid class ID", 400);
      }

      const classData = await ClassService.getClassById(classId);
      if (!classData) {
        throw new CustomError("Class not found", 404);
      }

      const updatedClass = await ClassService.updateClass(classId, updateData);

      const response: ApiResponse = {
        success: true,
        message: "Class updated successfully",
        data: { class: updatedClass }
      };

      logger.info(`Class ${classId} updated successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Update class error:", error);
      throw error;
    }
  }

  // Get classes by school
  static async getClassesBySchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const schoolIdNum = parseInt(schoolId);
      if (isNaN(schoolIdNum)) {
        throw new CustomError("Invalid school ID", 400);
      }

      const classes = await ClassService.getClassesBySchool(schoolIdNum, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        orderBy: 'name',
        orderDirection: 'asc'
      });

      const response: ApiResponse = {
        success: true,
        message: "Classes by school retrieved successfully",
        data: { classes }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get classes by school error:", error);
      throw error;
    }
  }

  // Get class statistics
  static async getClassStats(req: Request, res: Response) {
    try {
      const { school_id } = req.query;

      const filters: Record<string, any> = {};
      if (school_id) filters.school_id = parseInt(school_id as string);

      const stats = await ClassService.getClassStats(filters);

      const response: ApiResponse = {
        success: true,
        message: "Class statistics retrieved successfully",
        data: { stats }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get class statistics error:", error);
      throw error;
    }
  }

  // Delete class
  static async deleteClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const classId = parseInt(id);

      if (isNaN(classId)) {
        throw new CustomError("Invalid class ID", 400);
      }

      const classData = await ClassService.getClassById(classId);
      if (!classData) {
        throw new CustomError("Class not found", 404);
      }

      await ClassService.deleteClass(classId);

      const response: ApiResponse = {
        success: true,
        message: "Class deleted successfully"
      };

      logger.info(`Class ${classId} deleted successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Delete class error:", error);
      throw error;
    }
  }
}
