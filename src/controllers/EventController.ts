import { Request, Response } from "express";
import { EventService } from "../services/EventService";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import { ApiResponse } from "../types";

export class EventController {
  // Get all events
  static async getAllEvents(req: Request, res: Response) {
    try {
      const { page = 1, limit = 50, school_id, status } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const filters: Record<string, any> = {};
      if (school_id) filters.school_id = parseInt(school_id as string);
      if (status) filters.status = status;

      const events = await EventService.getAllEvents(filters, {
        limit: limitNum,
        offset: offset,
        orderBy: 'date',
        orderDirection: 'asc'
      });

      const totalCount = await EventService.getEventCount(filters);

      const response: ApiResponse = {
        success: true,
        message: "Events retrieved successfully",
        data: { events },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get all events error:", error);
      throw error;
    }
  }

  // Get event by ID
  static async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const eventId = parseInt(id);

      if (isNaN(eventId)) {
        throw new CustomError("Invalid event ID", 400);
      }

      const event = await EventService.getEventById(eventId);
      if (!event) {
        throw new CustomError("Event not found", 404);
      }

      const response: ApiResponse = {
        success: true,
        message: "Event retrieved successfully",
        data: { event }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get event by ID error:", error);
      throw error;
    }
  }

  // Create new event
  static async createEvent(req: Request, res: Response) {
    try {
      const eventData = req.body;

      // Set default status if not provided
      if (!eventData.status) {
        eventData.status = 'upcoming';
      }

      const newEvent = await EventService.createEvent(eventData);

      const response: ApiResponse = {
        success: true,
        message: "Event created successfully",
        data: { event: newEvent }
      };

      logger.info(`Event created successfully with ID: ${newEvent.id}`);
      res.status(201).json(response);
    } catch (error) {
      logger.error("Create event error:", error);
      throw error;
    }
  }

  // Update event
  static async updateEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const eventId = parseInt(id);
      const updateData = req.body;

      if (isNaN(eventId)) {
        throw new CustomError("Invalid event ID", 400);
      }

      const event = await EventService.getEventById(eventId);
      if (!event) {
        throw new CustomError("Event not found", 404);
      }

      const updatedEvent = await EventService.updateEvent(eventId, updateData);

      const response: ApiResponse = {
        success: true,
        message: "Event updated successfully",
        data: { event: updatedEvent }
      };

      logger.info(`Event ${eventId} updated successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Update event error:", error);
      throw error;
    }
  }

  // Get events by school
  static async getEventsBySchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      const { limit = 50, offset = 0, status } = req.query;

      const schoolIdNum = parseInt(schoolId);
      if (isNaN(schoolIdNum)) {
        throw new CustomError("Invalid school ID", 400);
      }

      const filters: Record<string, any> = { school_id: schoolIdNum };
      if (status) filters.status = status;

      const events = await EventService.getEventsBySchool(schoolIdNum, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        orderBy: 'date',
        orderDirection: 'asc'
      });

      const response: ApiResponse = {
        success: true,
        message: "Events by school retrieved successfully",
        data: { events }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get events by school error:", error);
      throw error;
    }
  }

  // Get upcoming events
  static async getUpcomingEvents(req: Request, res: Response) {
    try {
      const { limit = 10, school_id } = req.query;

      const filters: Record<string, any> = { status: 'upcoming' };
      if (school_id) filters.school_id = parseInt(school_id as string);

      const events = await EventService.getUpcomingEvents(filters, {
        limit: parseInt(limit as string),
        orderBy: 'date',
        orderDirection: 'asc'
      });

      const response: ApiResponse = {
        success: true,
        message: "Upcoming events retrieved successfully",
        data: { events }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get upcoming events error:", error);
      throw error;
    }
  }

  // Get event statistics
  static async getEventStats(req: Request, res: Response) {
    try {
      const { school_id } = req.query;

      const filters: Record<string, any> = {};
      if (school_id) filters.school_id = parseInt(school_id as string);

      const stats = await EventService.getEventStats(filters);

      const response: ApiResponse = {
        success: true,
        message: "Event statistics retrieved successfully",
        data: { stats }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get event statistics error:", error);
      throw error;
    }
  }

  // Delete event
  static async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const eventId = parseInt(id);

      if (isNaN(eventId)) {
        throw new CustomError("Invalid event ID", 400);
      }

      const event = await EventService.getEventById(eventId);
      if (!event) {
        throw new CustomError("Event not found", 404);
      }

      await EventService.deleteEvent(eventId);

      const response: ApiResponse = {
        success: true,
        message: "Event deleted successfully"
      };

      logger.info(`Event ${eventId} deleted successfully`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Delete event error:", error);
      throw error;
    }
  }
}
