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

  // PostgreSQL/Supabase specific errors
  if ((err as any).code === '23505') {
    const message = "Duplicate entry - resource already exists";
    error = new CustomError(message, 400);
  }

  if ((err as any).code === '23503') {
    const message = "Foreign key constraint violation";
    error = new CustomError(message, 400);
  }

  if ((err as any).code === '23502') {
    const message = "Required field is missing";
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
