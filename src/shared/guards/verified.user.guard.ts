import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserStatusEnum } from 'src/user/enums/user.status.enum';

@Injectable()
export class VerifiedUserGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();

    if (user.status === UserStatusEnum.tier3) {
      return true;
    } else {
      return false;
    }
  }
}
