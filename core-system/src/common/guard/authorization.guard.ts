import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_REQUIRED_PERMISSIONS_KEY } from '../decorators/auth.metadata';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService : AuthService
  ){

  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    const requirePermissions = this.reflector.getAllAndOverride<string[]>(IS_REQUIRED_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    console.log({requirePermissions})

    if (!requirePermissions) return true;
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    
    const hasPermission = await this.authService.checkPermission(userId,requirePermissions)

    if (!hasPermission) return false

    return true

  }
}
