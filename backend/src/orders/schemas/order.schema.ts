import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export class OrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number; // snapshot in pence
  quantity: number;
  imageUrl: string | null;
}

export class ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: MongooseSchema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number,
        imageUrl: { type: String, default: null },
      },
    ],
    required: true,
  })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  subtotal: number; // pence

  @Prop({ required: true, min: 0 })
  shipping: number; // pence

  @Prop({ required: true, min: 0 })
  total: number; // pence

  @Prop({
    type: {
      fullName: String,
      line1: String,
      line2: { type: String, default: '' },
      city: String,
      postcode: String,
      country: String,
    },
    required: true,
  })
  shippingAddress: ShippingAddress;

  @Prop({
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  })
  status: OrderStatus;

  @Prop({ type: String, default: null })
  paymentReference: string | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
