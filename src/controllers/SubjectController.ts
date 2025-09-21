import { Request, Response } from "express";
import { SubjectService } from "../services/SubjectService";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import { ApiResponse } from "../types";

export class SubjectController {
  // Get all subjects
  static async getAllSubjects(req: Request, res: Response) {
    try {
      const { page = 1, limit = 50, class_id, school_id } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const filters: Record<string, any> = {};
      if (class_id) filters.class_id = parseInt(class_id as string);
      if (school_id) filters.school_id = parseInt(school_id as string);

      const subjects = await SubjectService.getAllSubjects(filters, {
        limit: limitNum,
        offset: offset,
        orderBy: 'subject_name',
        orderDirection: 'asc'
      });

      const totalCount = await SubjectService.getSubjectCount(filters);

      const response: ApiResponse = {
        success: true,
        message: "Subjects retrieved successfully",
        data: { subjects },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get all subjects error:", error);
      throw error;
    }
  }

  // Get subject by ID
  static async getSubjectById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subjectId = parseInt(id);

      if (isNaN(subjectId)) {
        throw new CustomError("Invalid subject ID", 400);
      }

      const subject = await SubjectService.getSubjectById(subjectId);
      if (!subject) {
        throw new CustomError("Subject not found", 404);
      }

      const response: ApiResponse = {
        success: true,
        message: "Subject retrieved successfully",
        data: { subject }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get subject by ID error:", error);
      throw error;
    }
  }

  // Create new subject
  static async createSubject(req: Request, res: Response) {
    try {
      const subjectData = req.body;

      const newSubject = await SubjectService.createSubject(subjectData);

      const response: ApiResponse = {
        success: true,
        message: "Subject created successfully",
        data: { subject: newSubject }
      };

      logger.info(`Subject created successfully with ID: ${newSubject.id}`);
      res.status(201).json(response);
    } catch (error) {
      logger.error("Create subject error:", error);
      throw error;
    }
  }

  // Update subject
  static async updateSubject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subjectId = parseInt(id);
      const updateData = req.body;

      if (isNaN(subjectId)) {
        throw new CustomError("Invalid subject ID", 400);
      }

      const subject = await SubjectService.getSubjectById(subjectId);
      if (!subject) {
        throw new CustomError("Subject not found", 404);
      }

      const updatedSubject = await SubjectService.updateSubject(subjectId, updateData);

      const response: ApiResponse = {
        success: true,
        message: "Subject updated successfully",
        data: { subject: updatedSubject }
      };

      logger.info(`Subject ${subjectId} updated successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Update subject error:", error);
      throw error;
    }
  }

  // Get subjects by class
  static async getSubjectsByClass(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const classIdNum = parseInt(classId);
      if (isNaN(classIdNum)) {
        throw new CustomError("Invalid class ID", 400);
      }

      const subjects = await SubjectService.getSubjectsByClass(classIdNum, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        orderBy: 'subject_name',
        orderDirection: 'asc'
      });

      const response: ApiResponse = {
        success: true,
        message: "Subjects by class retrieved successfully",
        data: { subjects }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get subjects by class error:", error);
      throw error;
    }
  }

  // Get subjects by school
  static async getSubjectsBySchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const schoolIdNum = parseInt(schoolId);
      if (isNaN(schoolIdNum)) {
        throw new CustomError("Invalid school ID", 400);
      }

      const subjects = await SubjectService.getSubjectsBySchool(schoolIdNum, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        orderBy: 'subject_name',
        orderDirection: 'asc'
      });

      const response: ApiResponse = {
        success: true,
        message: "Subjects by school retrieved successfully",
        data: { subjects }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get subjects by school error:", error);
      throw error;
    }
  }

  // Get subject statistics
  static async getSubjectStats(req: Request, res: Response) {
    try {
      const { class_id, school_id } = req.query;

      const filters: Record<string, any> = {};
      if (class_id) filters.class_id = parseInt(class_id as string);
      if (school_id) filters.school_id = parseInt(school_id as string);

      const stats = await SubjectService.getSubjectStats(filters);

      const response: ApiResponse = {
        success: true,
        message: "Subject statistics retrieved successfully",
        data: { stats }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get subject statistics error:", error);
      throw error;
    }
  }

  // Delete subject
  static async deleteSubject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subjectId = parseInt(id);

      if (isNaN(subjectId)) {
        throw new CustomError("Invalid subject ID", 400);
      }

      const subject = await SubjectService.getSubjectById(subjectId);
      if (!subject) {
        throw new CustomError("Subject not found", 404);
      }

      await SubjectService.deleteSubject(subjectId);

      const response: ApiResponse = {
        success: true,
        message: "Subject deleted successfully"
      };

      logger.info(`Subject ${subjectId} deleted successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Delete subject error:", error);
      throw error;
    }
  }
}
