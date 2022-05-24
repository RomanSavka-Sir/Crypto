import { Controller, Post, UseGuards, HttpCode } from "@nestjs/common";
import { RolesGuard } from "src/shared/guards/role.guard";
import { AuthGuard } from '@nestjs/passport';
import { ManagerService } from "./manager.service";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiSecurity } from '@nestjs/swagger';
import { TokenDto } from "src/auth/dto/token.dto";
import { RegisterDto } from "src/auth/dto/register.dto";
import { GetUser } from "src/shared/decorators/get.user.decorator";
import { User } from "src/user/entities/user.entity";
import { Roles } from "src/shared/decorators/role.decorator";
import { RoleEnum } from "src/shared/enums/role.enum";


@ApiTags('manager')
@Roles(RoleEnum.manager)
@Controller('manager')
export class ManagerController {
    constructor(
        private managerService: ManagerService
    ) {}

}