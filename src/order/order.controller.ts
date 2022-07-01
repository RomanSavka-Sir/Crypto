import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { GetOrdersResponseDto } from './dto/get.orders.response.dto';
import {
  Controller,
  UseGuards,
  Post,
  Get,
  HttpCode,
  Body,
  Param,
  ParseIntPipe,
  Query
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
import { GetUser } from 'src/shared/decorators/get.user.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { RoleEnum } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { VerifiedUserGuard } from 'src/shared/guards/verified.user.guard';
import { User } from 'src/user/entities/user.entity';
import { CreateOrderDto } from './dto/create.order.dto';
import { OrderService } from './order.service';
import { GetTradesResponseDto } from './dto/get.trades.response.dto';
import { Pagination } from 'src/shared/decorators/pagination.decorator';
import { OrderFilterDto } from './dto/order.filter.dto';

@ApiTags('order')
@ApiSecurity('accessToken')
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard, VerifiedUserGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @ApiOperation({ summary: 'get orders' })
  @ApiResponse({ status: 200, type: GetOrdersResponseDto })
  @HttpCode(200)
  @Get('getOrders')
  async getOrders(): Promise<GetOrdersResponseDto> {
    return this.orderService.getOrders();
  }

  @ApiOperation({ summary: 'get trades' })
  @ApiResponse({ status: 200, type: GetTradesResponseDto })
  @HttpCode(200)
  @Get('getTrades')
  async getTrades(): Promise<GetTradesResponseDto> {
    return this.orderService.getTrades();
  }

  @ApiOperation({ summary: 'get all orders of user' })
  @ApiResponse({ status: 200, type: GetOrdersResponseDto })
  @ApiQuery({ type: PaginationDto })
  @HttpCode(200)
  @Get('getAllOrders')
  async getAllOrders(
    @Pagination() pagination: PaginationDto,
    @Query() filter: OrderFilterDto,
    @GetUser() user: User
  ): Promise<GetOrdersResponseDto> {
    return this.orderService.getAllOrders(pagination, filter, user.id);
  }

  @ApiOperation({ summary: 'create order by user' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: CreateOrderDto })
  @HttpCode(200)
  @Post('createOrder')
  async createOrder(
    @GetUser() user: User,
    @Body() data: CreateOrderDto
  ): Promise<string> {
    return this.orderService.createOrder(user.id, data);
  }

  @ApiOperation({ summary: 'cancel order by user' })
  @ApiResponse({ status: 200 })
  @HttpCode(200)
  @Post('/:orderId')
  async cancelOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @GetUser() user: User
  ): Promise<string> {
    return this.orderService.cancelOrder(orderId, user.id);
  }
}
