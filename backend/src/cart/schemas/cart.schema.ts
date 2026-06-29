import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CartDocument = Cart & Document;

export class CartItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  priceAtAdd: number; // snapshot in pence at time item was added
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({ type: [{ product: { type: MongooseSchema.Types.ObjectId, ref: 'Product' }, quantity: Number, priceAtAdd: Number }], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.index({ user: 1 }, { unique: true });
