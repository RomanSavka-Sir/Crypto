import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/user/entities/user.role.entity';
import { Repository } from 'typeorm';
import { ROLES_KEY } from '../decorators/role.decorator';
import { RoleEnum } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const roles = await this.userRolesRepository.findOne({
      where: {
        userId: user.id
      }
    });

    return requiredRoles.some((role) => roles.roleId?.includes(role));
  }
}
