import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-codes.js';

export class BusinessException extends HttpException {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message: string, statusCode: HttpStatus) {
    super({ errorCode, message, statusCode }, statusCode);
    this.errorCode = errorCode;
  }
}
