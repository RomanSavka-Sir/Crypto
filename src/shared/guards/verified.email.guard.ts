import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserStatusEnum } from 'src/user/enums/user.status.enum';

@Injectable()
export class VerifiedEmailGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();

    if (
      user.status === UserStatusEnum.tier2 ||
      user.status === UserStatusEnum.tier3
    ) {
      return true;
    } else {
      return false;
    }
  }
}
