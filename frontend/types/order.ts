export interface OrderItem {
  productId: string;
  name: string;
  price: number; // pence snapshot
  quantity: number;
  imageUrl: string | null;
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  paymentReference: string | null;
  createdAt: string;
}
