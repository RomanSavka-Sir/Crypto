import { AuthService } from 'src/auth/auth.service';
import {
  Controller,
  UseGuards,
  HttpCode,
  Get,
  Post,
  Param,
  Res,
  Query,
  Body
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags
} from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/role.decorator';
import { RoleEnum } from 'src/shared/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { GetMarketResponseDto } from './dto/get.market.response.dto';
import { Pagination } from 'src/shared/decorators/pagination.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SearchQueryDto } from './dto/search.query.dto';
import { GetUsersResponseDto } from 'src/user/dto/get.users.response.dto';
import { ChangePasswordDto } from 'src/auth/dto/change.password.dto';
import { GetUser } from 'src/shared/decorators/get.user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('manager')
@ApiSecurity('accessToken')
@Roles(RoleEnum.manager)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('manager')
export class ManagerController {
  constructor(
    private managerService: ManagerService,
    private authService: AuthService
  ) {}

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
}
