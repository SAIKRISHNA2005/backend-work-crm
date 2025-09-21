import { Request, Response } from "express";
import { AttendanceService } from "../services/AttendanceService";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import { ApiResponse } from "../types";

export class AttendanceController {
  // Get attendance records
  static async getAttendance(req: Request, res: Response) {
    try {
      const { student_id, class_id, date, teacher_id } = req.query;
      const { page = 1, limit = 50 } = req.query;
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const filters: Record<string, any> = {};
      if (student_id) filters.student_id = parseInt(student_id as string);
      if (class_id) filters.class_id = parseInt(class_id as string);
      if (teacher_id) filters.teacher_id = parseInt(teacher_id as string);
      if (date) filters.date = date;

          const attendance = await AttendanceService.getAttendanceRecords(filters, {
            limit: limitNum,
            offset: offset,
            orderBy: 'date',
            orderDirection: 'desc'
          });

          const totalCount = await AttendanceService.getAttendanceCount(filters);

      const response: ApiResponse = {
        success: true,
        message: "Attendance records retrieved successfully",
        data: { attendance },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get attendance error:", error);
      throw error;
    }
  }

  // Create attendance record
  static async createAttendance(req: Request, res: Response) {
    try {
      const attendanceData = req.body;

          const attendance = await AttendanceService.createAttendanceRecord(attendanceData);

      const response: ApiResponse = {
        success: true,
        message: "Attendance record created successfully",
        data: { attendance }
      };

      logger.info(`Attendance record created for student ${attendanceData.student_id}`);
      res.status(201).json(response);
    } catch (error) {
      logger.error("Create attendance error:", error);
      throw error;
    }
  }

  // Update attendance record
  static async updateAttendance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const attendanceId = parseInt(id);
      const updateData = req.body;

      if (isNaN(attendanceId)) {
        throw new CustomError("Invalid attendance ID", 400);
      }

          const attendance = await AttendanceService.getAttendanceRecordById(attendanceId);
          if (!attendance) {
            throw new CustomError("Attendance record not found", 404);
          }

          const updatedAttendance = await AttendanceService.updateAttendanceRecord(attendanceId, updateData);

      const response: ApiResponse = {
        success: true,
        message: "Attendance record updated successfully",
        data: { attendance: updatedAttendance }
      };

      logger.info(`Attendance record ${attendanceId} updated successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Update attendance error:", error);
      throw error;
    }
  }

  // Bulk update attendance for a class
  static async bulkUpdateAttendance(req: Request, res: Response) {
    try {
      const { classCode, date, present, absent, late } = req.body;

      if (!classCode || !date) {
        throw new CustomError("Class code and date are required", 400);
      }

          const results = await AttendanceService.bulkUpdateAttendance({
            classCode,
            date,
            present: present || [],
            absent: absent || [],
            late: late || []
          });

      const response: ApiResponse = {
        success: true,
        message: "Bulk attendance update completed successfully",
        data: { attendance: results }
      };

      logger.info(`Bulk attendance updated for class ${classCode} on ${date}`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Bulk update attendance error:", error);
      throw error;
    }
  }

  // Get attendance statistics
  static async getAttendanceStats(req: Request, res: Response) {
    try {
      const { student_id, class_id, date_from, date_to } = req.query;

      // This would require more complex queries to calculate statistics
      // For now, return basic info
      const filters: Record<string, any> = {};
      if (student_id) filters.student_id = parseInt(student_id as string);
      if (class_id) filters.class_id = parseInt(class_id as string);

          const stats = await AttendanceService.getAttendanceStats(filters);

      const response: ApiResponse = {
        success: true,
        message: "Attendance statistics retrieved successfully",
        data: { stats }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get attendance statistics error:", error);
      throw error;
    }
  }

  // Delete attendance record
  static async deleteAttendance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const attendanceId = parseInt(id);

      if (isNaN(attendanceId)) {
        throw new CustomError("Invalid attendance ID", 400);
      }

          const attendance = await AttendanceService.getAttendanceRecordById(attendanceId);
          if (!attendance) {
            throw new CustomError("Attendance record not found", 404);
          }

          await AttendanceService.deleteAttendanceRecord(attendanceId);

      const response: ApiResponse = {
        success: true,
        message: "Attendance record deleted successfully"
      };

      logger.info(`Attendance record ${attendanceId} deleted successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Delete attendance error:", error);
      throw error;
    }
  }
}
