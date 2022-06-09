import { InputDataBalanceDto } from './../balance/dto/input.data.balance.dto';
import { BalanceService } from './../balance/balance.service';
import { BalanceDto } from './../balance/dto/balance.dto';
import { VerifiedEmailGuard } from './../shared/guards/verified.email.guard';
import {
  Controller,
  UseGuards,
  HttpCode,
  Get,
  Patch,
  Body,
  Post
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
  constructor(
    private userService: UserService,
    private balanceService: BalanceService
  ) {}

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

  @ApiOperation({ summary: 'top up balance for user' })
  @ApiResponse({ status: 200, type: BalanceDto })
  @ApiBody({ type: InputDataBalanceDto })
  @HttpCode(200)
  @Post('topUpBalance')
  async topUpMoney(
    @GetUser() user: User,
    @Body() data: InputDataBalanceDto
  ): Promise<BalanceDto> {
    return this.balanceService.topUpBalance(user.id, data);
  }

  @ApiOperation({ summary: 'withdraw balance for user' })
  @ApiResponse({ status: 200, type: BalanceDto })
  @ApiBody({ type: InputDataBalanceDto })
  @HttpCode(200)
  @Post('withdrawBalance')
  async withdrawBalance(
    @GetUser() user: User,
    @Body() data: InputDataBalanceDto
  ): Promise<BalanceDto> {
    return this.balanceService.withdrawBalance(user.id, data);
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
