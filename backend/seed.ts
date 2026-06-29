import 'reflect-metadata';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/shopforge';

// ── Schemas ────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: 'customer' },
  refreshToken: { type: String, default: null },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  description: { type: String, default: '' },
  price: Number,
  stock: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  imageUrl: { type: String, default: null },
  images: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  items: {
    type: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      priceAtAdd: Number,
      quantity: Number,
      imageUrl: { type: String, default: null },
    }],
    default: [],
  },
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: Array,
  subtotal: Number,
  shipping: Number,
  total: Number,
  shippingAddress: Object,
  status: { type: String, default: 'pending' },
  paymentReference: { type: String, default: null },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Category = mongoose.model('Category', CategorySchema);
const Product = mongoose.model('Product', ProductSchema);
const Cart = mongoose.model('Cart', CartSchema);
const Order = mongoose.model('Order', OrderSchema);

// ── Helpers ────────────────────────────────────────────────────────────────

function slug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

// ── Seed ───────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Wipe existing data
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // ── Users ──────────────────────────────────────────────────────────────
  // Roles: admin | customer
  const [adminHash, customer1Hash, customer2Hash] = await Promise.all([
    bcrypt.hash('Admin@123!', 12),
    bcrypt.hash('Customer@123!', 12),
    bcrypt.hash('Jane@123!', 12),
  ]);

  const [admin, customer1, customer2] = await User.insertMany([
    {
      name: 'Admin User',
      email: 'admin@shopforge.com',
      passwordHash: adminHash,
      role: 'admin',
    },
    {
      name: 'John Customer',
      email: 'customer@shopforge.com',
      passwordHash: customer1Hash,
      role: 'customer',
    },
    {
      name: 'Jane Doe',
      email: 'jane@shopforge.com',
      passwordHash: customer2Hash,
      role: 'customer',
    },
  ]);
  console.log('Created 3 users (1 admin, 2 customers)');

  // ── Categories ─────────────────────────────────────────────────────────
  const categoryData = [
    { name: 'Electronics', description: 'Phones, computers, gadgets and more' },
    { name: 'Clothing', description: 'Fashion for every occasion' },
    { name: 'Books', description: 'Fiction, non-fiction and everything in between' },
    { name: 'Home & Garden', description: 'Everything for your home and garden' },
    { name: 'Sports', description: 'Equipment and apparel for active lifestyles' },
  ];

  const categories = await Category.insertMany(
    categoryData.map((c) => ({ ...c, slug: slug(c.name) })),
  );
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c._id]));
  console.log(`Created ${categories.length} categories`);

  // ── Products — 4 per category ──────────────────────────────────────────
  const productData = [
    // Electronics
    { name: 'iPhone 15 Pro', description: 'Apple iPhone 15 Pro with titanium design, 48MP camera', price: 99999, stock: 25, category: 'Electronics', rating: 4.8, reviewCount: 312 },
    { name: 'Samsung Galaxy S24', description: 'Samsung flagship with AI features and stunning display', price: 84999, stock: 30, category: 'Electronics', rating: 4.7, reviewCount: 287 },
    { name: 'Sony WH-1000XM5', description: 'Industry-leading noise cancelling headphones', price: 34999, stock: 50, category: 'Electronics', rating: 4.9, reviewCount: 891 },
    { name: 'Apple MacBook Air M3', description: '13-inch MacBook Air with M3 chip, 15-hour battery', price: 129999, stock: 15, category: 'Electronics', rating: 4.8, reviewCount: 156 },
    // Clothing
    { name: 'Classic Oxford Shirt', description: 'Premium cotton Oxford shirt, timeless design', price: 4999, stock: 100, category: 'Clothing', rating: 4.5, reviewCount: 203 },
    { name: 'Slim Fit Chinos', description: 'Comfortable slim-fit chinos in stretch cotton', price: 3999, stock: 80, category: 'Clothing', rating: 4.3, reviewCount: 178 },
    { name: 'Merino Wool Jumper', description: 'Lightweight merino wool jumper, perfect for layering', price: 6999, stock: 60, category: 'Clothing', rating: 4.6, reviewCount: 134 },
    { name: 'Running Trainers Pro', description: 'High-performance running shoes with cushioned sole', price: 8999, stock: 45, category: 'Clothing', rating: 4.4, reviewCount: 267 },
    // Books
    { name: 'Atomic Habits', description: 'An Easy & Proven Way to Build Good Habits by James Clear', price: 1099, stock: 200, category: 'Books', rating: 4.9, reviewCount: 1243 },
    { name: 'The Psychology of Money', description: 'Timeless lessons on wealth, greed, and happiness', price: 999, stock: 175, category: 'Books', rating: 4.8, reviewCount: 987 },
    { name: 'Deep Work', description: 'Rules for Focused Success in a Distracted World by Cal Newport', price: 1199, stock: 150, category: 'Books', rating: 4.7, reviewCount: 756 },
    { name: 'Sapiens', description: 'A Brief History of Humankind by Yuval Noah Harari', price: 1299, stock: 120, category: 'Books', rating: 4.8, reviewCount: 2103 },
    // Home & Garden
    { name: 'Dyson V15 Detect', description: 'Powerful cordless vacuum with laser dust detection', price: 64999, stock: 20, category: 'Home & Garden', rating: 4.7, reviewCount: 445 },
    { name: 'Instant Pot Pro', description: '10-in-1 multi-use pressure cooker, 6 litre', price: 8999, stock: 35, category: 'Home & Garden', rating: 4.6, reviewCount: 892 },
    { name: 'Philips Hue Starter Kit', description: 'Smart lighting starter kit with 3 bulbs and bridge', price: 6999, stock: 40, category: 'Home & Garden', rating: 4.5, reviewCount: 334 },
    { name: 'Premium Wooden Cutting Board', description: 'Large acacia wood cutting board with juice groove', price: 2499, stock: 90, category: 'Home & Garden', rating: 4.8, reviewCount: 567 },
    // Sports
    { name: 'Yoga Mat Pro', description: 'Extra thick non-slip yoga mat with carrying strap', price: 2999, stock: 75, category: 'Sports', rating: 4.6, reviewCount: 423 },
    { name: 'Resistance Bands Set', description: 'Set of 5 resistance bands for home workouts', price: 1999, stock: 120, category: 'Sports', rating: 4.5, reviewCount: 312 },
    { name: 'Adjustable Dumbbell 24kg', description: 'Space-saving adjustable dumbbell, 2-24kg range', price: 14999, stock: 25, category: 'Sports', rating: 4.7, reviewCount: 189 },
    { name: 'Garmin Forerunner 255', description: 'GPS running watch with advanced training metrics', price: 29999, stock: 30, category: 'Sports', rating: 4.8, reviewCount: 567 },
  ];

  const products = await Product.insertMany(
    productData.map((p) => ({
      ...p,
      slug: slug(p.name),
      category: catMap[p.category],
    })),
  );
  console.log(`Created ${products.length} products`);

  // ── Convenient product lookup maps ────────────────────────────────────
  const byCategory = (catName: string) =>
    products.filter((p) => p.category.toString() === catMap[catName].toString());

  const electronics = byCategory('Electronics');
  const books = byCategory('Books');
  const sports = byCategory('Sports');
  const clothing = byCategory('Clothing');
  const home = byCategory('Home & Garden');

  // ── Carts ──────────────────────────────────────────────────────────────
  // customer1 has 2 items in their cart
  await Cart.insertMany([
    {
      user: customer1._id,
      items: [
        {
          productId: electronics[0]._id,
          name: electronics[0].name,
          price: electronics[0].price,
          priceAtAdd: electronics[0].price,
          quantity: 1,
          imageUrl: null,
        },
        {
          productId: books[0]._id,
          name: books[0].name,
          price: books[0].price,
          priceAtAdd: books[0].price,
          quantity: 2,
          imageUrl: null,
        },
      ],
    },
    // customer2 has 1 item in their cart
    {
      user: customer2._id,
      items: [
        {
          productId: sports[3]._id,
          name: sports[3].name,
          price: sports[3].price,
          priceAtAdd: sports[3].price,
          quantity: 1,
          imageUrl: null,
        },
      ],
    },
  ]);
  console.log('Created carts for 2 customers');

  // ── Orders ─────────────────────────────────────────────────────────────
  const addr1 = {
    fullName: 'John Customer',
    line1: '123 High Street',
    city: 'London',
    postcode: 'SW1A 1AA',
    country: 'United Kingdom',
  };
  const addr2 = {
    fullName: 'Jane Doe',
    line1: '45 Baker Street',
    city: 'Manchester',
    postcode: 'M1 1AE',
    country: 'United Kingdom',
  };

  await Order.insertMany([
    // customer1 — delivered order (Electronics)
    {
      user: customer1._id,
      items: [
        { productId: electronics[2]._id, name: electronics[2].name, price: electronics[2].price, quantity: 1, imageUrl: null },
      ],
      subtotal: electronics[2].price,
      shipping: 0,
      total: electronics[2].price,
      shippingAddress: addr1,
      status: 'delivered',
      paymentReference: 'PAY-SEED0001',
    },
    // customer1 — shipped order (Books)
    {
      user: customer1._id,
      items: [
        { productId: books[0]._id, name: books[0].name, price: books[0].price, quantity: 2, imageUrl: null },
        { productId: books[1]._id, name: books[1].name, price: books[1].price, quantity: 1, imageUrl: null },
      ],
      subtotal: books[0].price * 2 + books[1].price,
      shipping: 0,
      total: books[0].price * 2 + books[1].price,
      shippingAddress: addr1,
      status: 'shipped',
      paymentReference: 'PAY-SEED0002',
    },
    // customer1 — processing order (Electronics)
    {
      user: customer1._id,
      items: [
        { productId: electronics[0]._id, name: electronics[0].name, price: electronics[0].price, quantity: 1, imageUrl: null },
      ],
      subtotal: electronics[0].price,
      shipping: 0,
      total: electronics[0].price,
      shippingAddress: addr1,
      status: 'processing',
      paymentReference: 'PAY-SEED0003',
    },
    // customer1 — pending order (Clothing + Sports)
    {
      user: customer1._id,
      items: [
        { productId: clothing[0]._id, name: clothing[0].name, price: clothing[0].price, quantity: 1, imageUrl: null },
        { productId: sports[1]._id, name: sports[1].name, price: sports[1].price, quantity: 2, imageUrl: null },
      ],
      subtotal: clothing[0].price + sports[1].price * 2,
      shipping: 499,
      total: clothing[0].price + sports[1].price * 2 + 499,
      shippingAddress: addr1,
      status: 'pending',
      paymentReference: 'PAY-SEED0004',
    },
    // customer2 — delivered order (Home & Garden)
    {
      user: customer2._id,
      items: [
        { productId: home[1]._id, name: home[1].name, price: home[1].price, quantity: 1, imageUrl: null },
        { productId: home[3]._id, name: home[3].name, price: home[3].price, quantity: 1, imageUrl: null },
      ],
      subtotal: home[1].price + home[3].price,
      shipping: 0,
      total: home[1].price + home[3].price,
      shippingAddress: addr2,
      status: 'delivered',
      paymentReference: 'PAY-SEED0005',
    },
    // customer2 — cancelled order (Sports)
    {
      user: customer2._id,
      items: [
        { productId: sports[0]._id, name: sports[0].name, price: sports[0].price, quantity: 1, imageUrl: null },
      ],
      subtotal: sports[0].price,
      shipping: 0,
      total: sports[0].price,
      shippingAddress: addr2,
      status: 'cancelled',
      paymentReference: 'PAY-SEED0006',
    },
  ]);
  console.log('Created 6 seed orders (4 for customer1, 2 for customer2)');

  await mongoose.disconnect();

  console.log('\n✅ Seed complete!\n');
  console.log('┌──────────────────────────────────────────────────────────────┐');
  console.log('│                    SEEDED LOGIN CREDENTIALS                  │');
  console.log('├──────────────┬───────────────────────────────┬───────────────┤');
  console.log('│ Role         │ Email                         │ Password      │');
  console.log('├──────────────┼───────────────────────────────┼───────────────┤');
  console.log('│ Admin        │ admin@shopforge.com           │ Admin@123!    │');
  console.log('│ Customer 1   │ customer@shopforge.com        │ Customer@123! │');
  console.log('│ Customer 2   │ jane@shopforge.com            │ Jane@123!     │');
  console.log('└──────────────┴───────────────────────────────┴───────────────┘');
  console.log('\n  Admin panel:  http://localhost:3000/admin');
  console.log('  Storefront:   http://localhost:3000\n');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
