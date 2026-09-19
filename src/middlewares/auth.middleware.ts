import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../shared/AppError";
import { env } from "../environment";
import { AuthUser } from "../shared/types/express";

export const authenticateRoute = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid Authorization header", 401);
    }

    const token = header.slice("Bearer ".length);
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthUser;

    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError("Invalid or expired token", 401));
  }
};
