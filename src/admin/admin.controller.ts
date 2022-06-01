import { AuthService } from 'src/auth/auth.service';
import {
  Controller,
  Post,
  HttpCode,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Query,
  Res
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags
} from '@nestjs/swagger';
import { ChangePasswordDto } from 'src/auth/dto/change.password.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { GetManagersResponseDto } from 'src/manager/dto/get.managers.response.dto';
import { GetMarketResponseDto } from 'src/manager/dto/get.market.response.dto';
import { SearchQueryDto } from 'src/manager/dto/search.query.dto';
import { ManagerService } from 'src/manager/manager.service';
import { GetUser } from 'src/shared/decorators/get.user.decorator';
import { Pagination } from 'src/shared/decorators/pagination.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { RoleEnum } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { GetUserResponseDto } from 'src/user/dto/get.user.response.dto';
import { GetUsersResponseDto } from 'src/user/dto/get.users.response.dto';
import { UpdateUserDto } from 'src/user/dto/update.user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';
import { CreateManagerDto } from './dto/create.manager.dto';

@ApiTags('admin')
@ApiSecurity('accessToken')
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private managerService: ManagerService,
    private authService: AuthService
  ) {}

  @ApiOperation({ summary: 'get all managers' })
  @ApiResponse({ status: 200, type: GetManagersResponseDto })
  @ApiQuery({ type: PaginationDto })
  @HttpCode(200)
  @Get('getAllManagers')
  async getAllManagers(
    @Pagination() pagination: PaginationDto
  ): Promise<GetManagersResponseDto> {
    return this.adminService.getAllManagers(pagination);
  }

  @ApiOperation({ summary: 'get all markets' })
  @ApiResponse({ status: 200, type: GetMarketResponseDto })
  @ApiQuery({ type: PaginationDto })
  @HttpCode(200)
  @Get('allMarkets')
  async getAllMarkets(
    @Pagination() pagination: PaginationDto
  ): Promise<GetMarketResponseDto> {
    return this.managerService.getAllMArkets(pagination);
  }

  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({ status: 200, type: GetUsersResponseDto })
  @ApiQuery({ type: PaginationDto })
  @HttpCode(200)
  @Get('getAllUsers')
  async getAllUsers(
    @Pagination() pagination: PaginationDto,
    @Query() search: SearchQueryDto
  ): Promise<GetUsersResponseDto> {
    return this.managerService.getAllUsers(pagination, search);
  }

  @ApiOperation({ summary: 'get photo of user' })
  @ApiResponse({ status: 200 })
  @HttpCode(200)
  @Get('/:photoId')
  async getUserPhoto(@Param('photoId') photoId: string, @Res() res) {
    return this.managerService.getUserPhoto(photoId, res);
  }

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

  @ApiOperation({ summary: 'activate market by manager' })
  @ApiResponse({ status: 200 })
  @HttpCode(200)
  @Post('activateMarket/:marketId')
  async activateMarket(@Param('marketId') marketId: string): Promise<string> {
    return this.managerService.activateMarket(marketId);
  }

  @ApiOperation({ summary: 'deacrivate market by manager' })
  @ApiResponse({ status: 200 })
  @HttpCode(200)
  @Post('deactivateMarket/:marketId')
  async deactivateMarket(@Param('marketId') marketId: string): Promise<string> {
    return this.managerService.deactivateMarket(marketId);
  }

  @ApiOperation({ summary: 'confirm photo of user' })
  @ApiResponse({ status: 200 })
  @HttpCode(200)
  @Post('confirmPhoto/:photoId')
  async confirmPhoto(@Param('photoId') photoId: string): Promise<string> {
    return this.managerService.confirmPhoto(photoId);
  }

  @ApiOperation({ summary: 'reject photot of user' })
  @ApiResponse({ status: 200 })
  @HttpCode(200)
  @Post('rejectPhoto/:photoId')
  async rejectPhoto(@Param('photoId') photoId: string): Promise<string> {
    return this.managerService.rejectPhoto(photoId);
  }

  @ApiOperation({ summary: 'change password of user' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: ChangePasswordDto })
  @HttpCode(200)
  @Post('changeUserPassword/:userId')
  async changeUserPassword(
    @Body() data: ChangePasswordDto,
    @Param('userId') userId: number
  ): Promise<string> {
    return this.authService.changePassword(data, userId);
  }

  @ApiOperation({ summary: 'change password of maanger' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: ChangePasswordDto })
  @HttpCode(200)
  @Post('changeManagerPassword/:managerId')
  async changeManagerPassword(
    @Body() data: ChangePasswordDto,
    @Param('managerId') managerId: number,
    @GetUser() admin: User
  ): Promise<string> {
    return this.adminService.changeManagerPassword(data, managerId);
  }

  @ApiOperation({ summary: 'update manager' })
  @ApiResponse({ status: 200, type: GetUserResponseDto })
  @ApiBody({ type: UpdateUserDto })
  @HttpCode(200)
  @Patch('/:managerId')
  async updateManager(
    @Param('managerId', ParseIntPipe) managerId: number,
    @Body() data: UpdateUserDto,
    @GetUser() admin: User
  ): Promise<GetUserResponseDto> {
    return this.userService.updateUser(managerId, data, admin.id);
  }

  @ApiOperation({ summary: 'delete manager' })
  @ApiResponse({ status: 200 })
  @HttpCode(200)
  @Delete('/:managerId')
  async deleteManager(
    @Param('managerId', ParseIntPipe) managerId: number
  ): Promise<string> {
    return this.adminService.deleteManager(managerId);
  }
}
