import { GetOrdersResponseDto } from './dto/get.orders.response.dto';
import {
  Controller,
  UseGuards,
  Post,
  Get,
  HttpCode,
  Body,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
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
import { parseCommandLine } from 'typescript';

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
  async getOrders(@GetUser() user: User): Promise<GetOrdersResponseDto> {
    return this.orderService.getOrders(user.id);
  }

  @ApiOperation({ summary: 'get trades' })
  @ApiResponse({ status: 200, type: GetTradesResponseDto })
  @HttpCode(200)
  @Get('getTrades')
  async getTrades(@GetUser() user: User): Promise<GetTradesResponseDto> {
    return this.orderService.getTrades(user.id);
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
