import { Request, Response } from "express";
import { NoteService } from "../services/NoteService";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import { ApiResponse } from "../types";

export class NoteController {
  // Get all notes
  static async getAllNotes(req: Request, res: Response) {
    try {
      const { page = 1, limit = 50, teacher_id, class_id, subject_id, is_published } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const filters: Record<string, any> = {};
      if (teacher_id) filters.teacher_id = parseInt(teacher_id as string);
      if (class_id) filters.class_id = parseInt(class_id as string);
      if (subject_id) filters.subject_id = parseInt(subject_id as string);
      if (is_published !== undefined) filters.is_published = is_published === 'true';

      const notes = await NoteService.getAllNotes(filters, {
        limit: limitNum,
        offset: offset,
        orderBy: 'uploaded_at',
        orderDirection: 'desc'
      });

      const totalCount = await NoteService.getNoteCount(filters);

      const response: ApiResponse = {
        success: true,
        message: "Notes retrieved successfully",
        data: { notes },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get all notes error:", error);
      throw error;
    }
  }

  // Get note by ID
  static async getNoteById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const noteId = parseInt(id);

      if (isNaN(noteId)) {
        throw new CustomError("Invalid note ID", 400);
      }

      const note = await NoteService.getNoteById(noteId);
      if (!note) {
        throw new CustomError("Note not found", 404);
      }

      const response: ApiResponse = {
        success: true,
        message: "Note retrieved successfully",
        data: { note }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get note by ID error:", error);
      throw error;
    }
  }

  // Create new note
  static async createNote(req: Request, res: Response) {
    try {
      const noteData = req.body;

      // Set default values
      if (noteData.is_published === undefined) {
        noteData.is_published = false;
      }
      if (!noteData.uploaded_at) {
        noteData.uploaded_at = new Date().toISOString();
      }

      const newNote = await NoteService.createNote(noteData);

      const response: ApiResponse = {
        success: true,
        message: "Note created successfully",
        data: { note: newNote }
      };

      logger.info(`Note created successfully with ID: ${newNote.id}`);
      res.status(201).json(response);
    } catch (error) {
      logger.error("Create note error:", error);
      throw error;
    }
  }

  // Update note
  static async updateNote(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const noteId = parseInt(id);
      const updateData = req.body;

      if (isNaN(noteId)) {
        throw new CustomError("Invalid note ID", 400);
      }

      const note = await NoteService.getNoteById(noteId);
      if (!note) {
        throw new CustomError("Note not found", 404);
      }

      const updatedNote = await NoteService.updateNote(noteId, updateData);

      const response: ApiResponse = {
        success: true,
        message: "Note updated successfully",
        data: { note: updatedNote }
      };

      logger.info(`Note ${noteId} updated successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Update note error:", error);
      throw error;
    }
  }

  // Get notes by teacher
  static async getNotesByTeacher(req: Request, res: Response) {
    try {
      const { teacherId } = req.params;
      const { limit = 50, offset = 0, is_published } = req.query;

      const teacherIdNum = parseInt(teacherId);
      if (isNaN(teacherIdNum)) {
        throw new CustomError("Invalid teacher ID", 400);
      }

      const filters: Record<string, any> = { teacher_id: teacherIdNum };
      if (is_published !== undefined) filters.is_published = is_published === 'true';

      const notes = await NoteService.getNotesByTeacher(teacherIdNum, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        orderBy: 'uploaded_at',
        orderDirection: 'desc'
      });

      const response: ApiResponse = {
        success: true,
        message: "Notes by teacher retrieved successfully",
        data: { notes }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get notes by teacher error:", error);
      throw error;
    }
  }

  // Get notes by class
  static async getNotesByClass(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const { limit = 50, offset = 0, is_published } = req.query;

      const classIdNum = parseInt(classId);
      if (isNaN(classIdNum)) {
        throw new CustomError("Invalid class ID", 400);
      }

      const filters: Record<string, any> = { class_id: classIdNum };
      if (is_published !== undefined) filters.is_published = is_published === 'true';

      const notes = await NoteService.getNotesByClass(classIdNum, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        orderBy: 'uploaded_at',
        orderDirection: 'desc'
      });

      const response: ApiResponse = {
        success: true,
        message: "Notes by class retrieved successfully",
        data: { notes }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get notes by class error:", error);
      throw error;
    }
  }

  // Get published notes
  static async getPublishedNotes(req: Request, res: Response) {
    try {
      const { limit = 50, class_id, subject_id } = req.query;

      const filters: Record<string, any> = { is_published: true };
      if (class_id) filters.class_id = parseInt(class_id as string);
      if (subject_id) filters.subject_id = parseInt(subject_id as string);

      const notes = await NoteService.getPublishedNotes(filters, {
        limit: parseInt(limit as string),
        orderBy: 'uploaded_at',
        orderDirection: 'desc'
      });

      const response: ApiResponse = {
        success: true,
        message: "Published notes retrieved successfully",
        data: { notes }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get published notes error:", error);
      throw error;
    }
  }

  // Publish/unpublish note
  static async toggleNotePublish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const noteId = parseInt(id);
      const { is_published } = req.body;

      if (isNaN(noteId)) {
        throw new CustomError("Invalid note ID", 400);
      }

      const note = await NoteService.getNoteById(noteId);
      if (!note) {
        throw new CustomError("Note not found", 404);
      }

      const updatedNote = await NoteService.updateNote(noteId, { is_published });

      const response: ApiResponse = {
        success: true,
        message: `Note ${is_published ? 'published' : 'unpublished'} successfully`,
        data: { note: updatedNote }
      };

      logger.info(`Note ${noteId} ${is_published ? 'published' : 'unpublished'} successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Toggle note publish error:", error);
      throw error;
    }
  }

  // Get note statistics
  static async getNoteStats(req: Request, res: Response) {
    try {
      const { teacher_id, class_id } = req.query;

      const filters: Record<string, any> = {};
      if (teacher_id) filters.teacher_id = parseInt(teacher_id as string);
      if (class_id) filters.class_id = parseInt(class_id as string);

      const stats = await NoteService.getNoteStats(filters);

      const response: ApiResponse = {
        success: true,
        message: "Note statistics retrieved successfully",
        data: { stats }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get note statistics error:", error);
      throw error;
    }
  }

  // Delete note
  static async deleteNote(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const noteId = parseInt(id);

      if (isNaN(noteId)) {
        throw new CustomError("Invalid note ID", 400);
      }

      const note = await NoteService.getNoteById(noteId);
      if (!note) {
        throw new CustomError("Note not found", 404);
      }

      await NoteService.deleteNote(noteId);

      const response: ApiResponse = {
        success: true,
        message: "Note deleted successfully"
      };

      logger.info(`Note ${noteId} deleted successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Delete note error:", error);
      throw error;
    }
  }
}
