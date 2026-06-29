import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import type { UserDocument } from '../users/schemas/user.schema';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create order from cart' })
  createOrder(@CurrentUser() user: UserDocument, @Body() dto: CreateOrderDto) {
    return this.ordersService.createFromCart(
      (user._id as unknown as { toString(): string }).toString(),
      dto,
    );
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my orders' })
  getMyOrders(@CurrentUser() user: UserDocument) {
    return this.ordersService.findByUser(
      (user._id as unknown as { toString(): string }).toString(),
    );
  }

  @Get('my/:id')
  @ApiOperation({ summary: 'Get single order (must belong to current user)' })
  getMyOrder(
    @CurrentUser() user: UserDocument,
    @Param('id', ParseMongoIdPipe) id: string,
  ) {
    return this.ordersService.findOneByUser(
      id,
      (user._id as unknown as { toString(): string }).toString(),
    );
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all orders (admin)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  getAllOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.ordersService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
    );
  }

  @Get('admin/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get single order (admin)' })
  getAdminOrder(@Param('id', ParseMongoIdPipe) id: string) {
    return this.ordersService.findOneAdmin(id);
  }

  @Patch('admin/:id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update order status (admin)' })
  updateStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
