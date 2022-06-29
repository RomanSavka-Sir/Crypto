import { Controller, UseGuards, Post, HttpCode, Body } from '@nestjs/common';
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

@ApiTags('order')
@ApiSecurity('accessToken')
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard, VerifiedUserGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

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
}
