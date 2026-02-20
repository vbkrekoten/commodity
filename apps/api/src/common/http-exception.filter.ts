import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      response.status(status).json({ data: null, error: body, meta: {} });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      error: { message: 'Internal server error' },
      meta: {},
    });
  }
}
