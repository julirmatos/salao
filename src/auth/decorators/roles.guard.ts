import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../usuarios/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 👉 se não tiver regra → libera
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // 👉 user vem do JWT
    return requiredRoles.includes(user.role);
  }
}