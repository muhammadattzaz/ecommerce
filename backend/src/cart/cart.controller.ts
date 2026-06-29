import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import type { UserDocument } from '../users/schemas/user.schema';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@CurrentUser() user: UserDocument) {
    return this.cartService.getCart((user._id as unknown as { toString(): string }).toString());
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@CurrentUser() user: UserDocument, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem((user._id as unknown as { toString(): string }).toString(), dto);
  }

  @Patch('items/:productId')
  @ApiOperation({ summary: 'Update cart item quantity (0 = remove)' })
  updateItem(
    @CurrentUser() user: UserDocument,
    @Param('productId', ParseMongoIdPipe) productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(
      (user._id as unknown as { toString(): string }).toString(),
      productId,
      dto,
    );
  }

  @Delete('items/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(
    @CurrentUser() user: UserDocument,
    @Param('productId', ParseMongoIdPipe) productId: string,
  ) {
    return this.cartService.removeItem(
      (user._id as unknown as { toString(): string }).toString(),
      productId,
    );
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear cart' })
  clearCart(@CurrentUser() user: UserDocument) {
    return this.cartService.clearCart((user._id as unknown as { toString(): string }).toString());
  }
}
