import {
  Controller,
  UseGuards,
  HttpCode,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Res,
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
import { GetPhotoResponseDto } from 'src/shared/dto/get.photo.response.dto';
import { UserIdDto } from 'src/user/dto/user.id.dto';
import { ResponseError } from '@sendgrid/mail';

@ApiTags('manager')
@ApiSecurity('accessToken')
@Roles(RoleEnum.manager)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('manager')
export class ManagerController {
  constructor(private managerService: ManagerService) {}

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

  @ApiOperation({ summary: 'get all user photos' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ type: PaginationDto })
  @HttpCode(200)
  @Get('allPhotos/:userId')
  async getAllUserPhotos(
    @Pagination() pagination: PaginationDto,
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<GetPhotoResponseDto> {
    return this.managerService.getAllUserPhotots(pagination, userId);
  }

  @ApiOperation({ summary: 'get photo of user' })
  @ApiResponse({ status: 200 })
  @HttpCode(200)
  @Get(':photoId')
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
  async deactivateMarket(@Param('marketId') marketId): Promise<string> {
    return this.managerService.deactivateMarket(marketId);
  }

  //   @ApiOperation({ summary: 'confirm user via photo' })
  //   @ApiResponse({ status: 200 })
  //   @ApiBody({ type: UserIdDto })
  //   @HttpCode(200)
  //   @Post('confirmUser')
  //   async confirmUser(@Body() data: UserIdDto): Promise<string> {
  //     return this.managerService.confirmUser(data);
  //   }
}
