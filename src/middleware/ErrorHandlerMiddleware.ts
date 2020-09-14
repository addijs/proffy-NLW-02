import { Request, Response, NextFunction } from 'express';
import { APIError } from './Error/APIError';

export default function errorMiddleware(error: APIError, req: Request, res: Response, next: NextFunction) {
  const status = error.status;
  const message = error.message;

  return res.status(status).json({
    status,
    message
  });
}