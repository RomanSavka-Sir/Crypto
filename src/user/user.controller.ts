import { Controller, UseGuards, HttpCode, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags
} from '@nestjs/swagger';
import { GetMarketResponseDto } from 'src/manager/dto/get.market.response.dto';
import { Pagination } from 'src/shared/decorators/pagination.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { RoleEnum } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { UserService } from './user.service';

@ApiTags('user')
@ApiSecurity('accessToken')
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'get all markets for user' })
  @ApiResponse({ status: 200, type: GetMarketResponseDto })
  @ApiQuery({ type: PaginationDto })
  @HttpCode(200)
  @Get()
  async getAllMarkets(
    @Pagination() pagination: PaginationDto
  ): Promise<GetMarketResponseDto> {
    return this.userService.getAllUsers(pagination);
  }
}
