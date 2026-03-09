import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from '../decorators/auth.metadata';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class RenewTokenInterceptor implements NestInterceptor {
  constructor(
    @Inject(LoggerService) private readonly logger: LoggerService,
    private reflector: Reflector,
    @Inject(AuthService) private readonly authService: AuthService
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return next.handle();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      mergeMap(async (data) => {
        const token = request.headers.authorization;
        const renewToken = await this.authService.renewToken(token);
        if (renewToken) response.set('Authorization', renewToken.accessToken);

        return data;
      })
    );
  }
}
