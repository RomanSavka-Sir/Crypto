import { Controller } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/role.decorator';
import { RoleEnum } from 'src/shared/enums/role.enum';

@ApiTags('manager')
@Roles(RoleEnum.manager)
@Controller('manager')
export class ManagerController {
  constructor(private managerService: ManagerService) {}
}
