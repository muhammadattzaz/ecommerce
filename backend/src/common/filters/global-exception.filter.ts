import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body = exception.getResponse();
      message =
        typeof body === 'object'
          ? ((body as { message?: string | string[] }).message ?? exception.message)
          : exception.message;
    } else if (exception instanceof MongoServerError && exception.code === 11000) {
      statusCode = HttpStatus.CONFLICT;
      message = 'Duplicate key — resource already exists';
    } else {
      this.logger.error(exception);
    }

    res.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
