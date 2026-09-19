import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import AppError from "../shared/AppError";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Error caught:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.flatten().fieldErrors,
    });
  }

  if (err instanceof AppError) {
    const response: Record<string, unknown> = {
      statusCode: err.statusCode,
      message: err.message,
    };
    if (err.data !== undefined) response.data = err.data;
    return res.status(err.statusCode).json(response);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        message: "A record with these details already exists",
        fields: err.meta?.target,
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Requested record not found" });
    }
    return res
      .status(400)
      .json({ message: "Database request error", code: err.code });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res
      .status(400)
      .json({ message: "Invalid data provided to the database layer" });
  }

  return res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

export default errorHandler;
