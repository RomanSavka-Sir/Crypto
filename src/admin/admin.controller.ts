import { Controller, Post, HttpCode, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags
} from '@nestjs/swagger';
import { TokenDto } from 'src/auth/dto/token.dto';
import { GetUser } from 'src/shared/decorators/get.user.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { RoleEnum } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { User } from 'src/user/entities/user.entity';
import { AdminService } from './admin.service';
import { CreateManagerDto } from './dto/create.manager.dto';

@ApiTags('admin')
@ApiSecurity('accessToken')
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiOperation({ summary: 'create manager by admin' })
  @ApiResponse({ status: 200, type: TokenDto })
  @ApiBody({ type: CreateManagerDto })
  @HttpCode(200)
  @Post('createManager')
  async createManager(
    @Body() data: CreateManagerDto,
    @GetUser() admin: User
  ): Promise<TokenDto> {
    return this.adminService.createManager(data, admin.id);
  }
}
