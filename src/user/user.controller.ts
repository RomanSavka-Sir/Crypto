import { VerifiedUserGuard } from './../shared/guards/verified.user.guard';
import { VerifiedEmailGuard } from './../shared/guards/verified.email.guard';
import {
  Controller,
  UseGuards,
  HttpCode,
  Get,
  Patch,
  Post,
  Body
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
import { GetMarketResponseDto } from 'src/manager/dto/get.market.response.dto';
import { GetUser } from 'src/shared/decorators/get.user.decorator';
import { Pagination } from 'src/shared/decorators/pagination.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { RoleEnum } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { GetUserResponseDto } from './dto/get.user.response.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@ApiSecurity('accessToken')
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard, VerifiedEmailGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'get all markets for user' })
  @ApiResponse({ status: 200, type: GetMarketResponseDto })
  @ApiQuery({ type: PaginationDto })
  @HttpCode(200)
  @Get('allMarkets')
  async getAllMarkets(
    @Pagination() pagination: PaginationDto
  ): Promise<GetMarketResponseDto> {
    return this.userService.getAllMarkets(pagination);
  }

  @ApiOperation({ summary: 'get user' })
  @ApiResponse({ status: 200, type: GetUserResponseDto })
  @HttpCode(200)
  @Get('getUser')
  async getUser(@GetUser() user: User): Promise<GetUserResponseDto> {
    return this.userService.getuser(user.id);
  }

  @ApiOperation({ summary: 'update user' })
  @ApiResponse({ status: 200, type: GetUserResponseDto })
  @ApiBody({ type: UpdateUserDto })
  @HttpCode(200)
  @Patch('updateUser')
  async updateUser(
    @GetUser() user: User,
    @Body() data: UpdateUserDto
  ): Promise<GetUserResponseDto> {
    return this.userService.updateUser(user.id, data);
  }
}
