import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { BusinessException } from './business.exception.js';
import { ErrorCode } from './error-codes.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;
    let errorCode: ErrorCode;

    if (exception instanceof BusinessException) {
      errorCode = exception.errorCode;
      const res = exception.getResponse() as Record<string, unknown>;
      message = res.message as string;
    } else if (exception instanceof HttpException) {
      errorCode = this.mapHttpStatusToErrorCode(exception.getStatus());
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as Record<string, unknown>).message as string;
    } else if (exception instanceof Error) {
      errorCode = ErrorCode.INTERNAL_ERROR;
      message = exception.message;
    } else {
      errorCode = ErrorCode.INTERNAL_ERROR;
      message = 'Internal server error';
    }

    this.logger.error(
      `${request.method} ${request.url} ${status} [${errorCode}] - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      statusCode: status,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private mapHttpStatusToErrorCode(status: number): ErrorCode {
    switch (status) {
      case 400: return ErrorCode.VALIDATION_ERROR;
      case 429: return ErrorCode.GEMINI_RATE_LIMITED;
      case 503: return ErrorCode.GEMINI_QUEUE_FULL;
      default:  return ErrorCode.INTERNAL_ERROR;
    }
  }
}
