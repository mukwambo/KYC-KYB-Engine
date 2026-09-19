import { Response } from "express";

interface SendResponseOptions<T> {
  result?: T;
  message: string;
}

export const sendResponse = <T>(
  res: Response,
  { result, message }: SendResponseOptions<T>,
  statusCode = 200,
): Response => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    ...(result !== undefined ? { result } : {}),
  });
};
