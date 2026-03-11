import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  constructor(
    @Inject(LoggerService) private readonly logger: LoggerService
  ) {}
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException){
      const status = exception.getStatus();
      const isServerError = status >= 500;

      if (isServerError) {
        this.logger.error(`${request.method} ${request.url}`, exception.stack,GlobalExceptionFilter.name);

        return response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          message : "Internal server error",
        });
      }

      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message : exception.message
      })
    }

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
      GlobalExceptionFilter.name
    );

    return response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      message : "Internal server error",
    });
  }
}
