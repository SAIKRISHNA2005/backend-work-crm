import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { ApiResponse, AppError } from "../types";
import { config } from "../config/environment";

// Custom error class
export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err } as AppError;
  error.message = err.message;

  // Log error
  logger.error(`Error ${error.statusCode || 500}: ${error.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new CustomError(message, 404);
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    const message = `${field} already exists`;
    error = new CustomError(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values((err as any).errors).map((val: any) => val.message).join(", ");
    error = new CustomError(message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new CustomError(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new CustomError(message, 401);
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  const response: ApiResponse = {
    success: false,
    message,
    error: config.app.nodeEnv === "development" ? err.stack : undefined,
  };

  res.status(statusCode).json(response);
};

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};
