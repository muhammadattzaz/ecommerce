import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';
import { MockPaymentService } from './payment/mock-payment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, MockPaymentService],
  exports: [OrdersService],
})
export class OrdersModule {}
