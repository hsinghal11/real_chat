import { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
    statusCode?: number;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Error caught by global handler:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
