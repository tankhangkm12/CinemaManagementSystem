import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from '../decorators/auth.metadata';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private readonly authService : AuthService,
    private readonly logger : LoggerService

  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedException("Token not found");
    }
    try{
       const decode = await this.authService.verifyToken(token)
       request.userId = decode.id;
       return true
    }
    catch(e){
      const message = e instanceof Error ? e.message : String(e);
      this.logger.error("error verify token", message);
      throw new UnauthorizedException("Token not valid");
    }
  }
}
