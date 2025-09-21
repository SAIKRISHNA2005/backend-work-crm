import { Request, Response } from "express";
import { MarksService } from "../services/MarksService";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import { ApiResponse } from "../types";

export class MarksController {
  // Get marks records
  static async getMarks(req: Request, res: Response) {
    try {
      const { student_id, exam_subject_id } = req.query;
      const { page = 1, limit = 50 } = req.query;
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const filters: Record<string, any> = {};
      if (student_id) filters.student_id = parseInt(student_id as string);
      if (exam_subject_id) filters.exam_subject_id = parseInt(exam_subject_id as string);

      const marks = await MarksService.getMarksRecords(filters, {
        limit: limitNum,
        offset: offset,
        orderBy: 'created_at',
        orderDirection: 'desc'
      });

      const totalCount = await MarksService.getMarksCount(filters);

      const response: ApiResponse = {
        success: true,
        message: "Marks records retrieved successfully",
        data: { marksRecords: marks },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get marks error:", error);
      throw error;
    }
  }

  // Create marks record
  static async createMarks(req: Request, res: Response) {
    try {
      const marksData = req.body;

      // Calculate grade based on marks
      const grade = MarksController.calculateGrade(marksData.marks_obtained);
      marksData.grade = grade;

      const marks = await MarksService.createMarksRecord(marksData);

      const response: ApiResponse = {
        success: true,
        message: "Marks record created successfully",
        data: { marks }
      };

      logger.info(`Marks record created for student ${marksData.student_id}`);
      res.status(201).json(response);
    } catch (error) {
      logger.error("Create marks error:", error);
      throw error;
    }
  }

  // Update marks record
  static async updateMarks(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const marksId = parseInt(id);
      const updateData = req.body;

      if (isNaN(marksId)) {
        throw new CustomError("Invalid marks ID", 400);
      }

      const marks = await MarksService.getMarksRecordById(marksId);
      if (!marks) {
        throw new CustomError("Marks record not found", 404);
      }

      // Recalculate grade if marks are updated
      if (updateData.marks_obtained) {
        updateData.grade = MarksController.calculateGrade(updateData.marks_obtained);
      }

      const updatedMarks = await MarksService.updateMarksRecord(marksId, updateData);

      const response: ApiResponse = {
        success: true,
        message: "Marks record updated successfully",
        data: { marks: updatedMarks }
      };

      logger.info(`Marks record ${marksId} updated successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Update marks error:", error);
      throw error;
    }
  }

  // Get marks by student
  static async getMarksByStudent(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const studentIdNum = parseInt(studentId);
      if (isNaN(studentIdNum)) {
        throw new CustomError("Invalid student ID", 400);
      }

      const marks = await MarksService.getMarksByStudent(studentIdNum, {
        limit: limitNum,
        offset: offset,
        orderBy: 'created_at',
        orderDirection: 'desc'
      });

      const totalCount = await MarksService.getMarksCount({ student_id: studentIdNum });

      const response: ApiResponse = {
        success: true,
        message: "Student marks retrieved successfully",
        data: { marks },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get marks by student error:", error);
      throw error;
    }
  }

  // Get marks statistics
  static async getMarksStats(req: Request, res: Response) {
    try {
      const { student_id, exam_subject_id } = req.query;

      const filters: Record<string, any> = {};
      if (student_id) filters.student_id = parseInt(student_id as string);
      if (exam_subject_id) filters.exam_subject_id = parseInt(exam_subject_id as string);

      const stats = await MarksService.getMarksStats(filters);

      const response: ApiResponse = {
        success: true,
        message: "Marks statistics retrieved successfully",
        data: { stats }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get marks statistics error:", error);
      throw error;
    }
  }

  // Delete marks record
  static async deleteMarks(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const marksId = parseInt(id);

      if (isNaN(marksId)) {
        throw new CustomError("Invalid marks ID", 400);
      }

      const marks = await MarksService.getMarksRecordById(marksId);
      if (!marks) {
        throw new CustomError("Marks record not found", 404);
      }

      await MarksService.deleteMarksRecord(marksId);

      const response: ApiResponse = {
        success: true,
        message: "Marks record deleted successfully"
      };

      logger.info(`Marks record ${marksId} deleted successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Delete marks error:", error);
      throw error;
    }
  }

  // Helper method to calculate grade based on marks
  private static calculateGrade(marks: number): string {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C+';
    if (marks >= 40) return 'C';
    if (marks >= 30) return 'D';
    return 'F';
  }
}
