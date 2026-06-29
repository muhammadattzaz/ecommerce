# Backend Rules — ShopForge (`backend/`)

## Stack
NestJS 10 · MongoDB · Mongoose · JWT · Multer · class-validator · TypeScript 5 · Node 25

---

## Module Structure
Every feature module follows this exact layout:
```
<module>/
├── <module>.module.ts
├── <module>.controller.ts   ← route handlers only, no business logic
├── <module>.service.ts      ← all business logic, all Mongoose queries
├── dto/
│   ├── create-<module>.dto.ts
│   └── update-<module>.dto.ts   ← always PartialType(CreateDto)
└── schemas/
    └── <module>.schema.ts
```

---

## NestJS Patterns

### Controllers
- Route handlers call ONE service method — no logic in controllers
- All ObjectId params use `ParseMongoIdPipe`
- Every endpoint has `@ApiTags`, `@ApiOperation`, `@ApiResponse`
- Protected endpoints have `@ApiBearerAuth()`

```typescript
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiResponse({ status: 404 })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.productsService.findById(id);
  }
}
```

### Guards
```typescript
// Public — no decorator
@Get() findAll() {}

// Customer auth
@Get('me')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: UserDocument) {}

// Admin only
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
create(@Body() dto: CreateProductDto) {}
```

### Global Setup (main.ts)
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
app.useGlobalFilters(new GlobalExceptionFilter());
app.use(cookieParser());
app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });
app.setGlobalPrefix('api/v1');
```

---

## Mongoose Schema Patterns

```typescript
@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ required: true, min: 0 })
  price: number; // stored as integers (pence) — £29.99 = 2999

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 'text' });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ price: 1 });
```

### Indexes Required
```typescript
UserSchema.index({ email: 1 }, { unique: true });
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ name: 'text' });
CartSchema.index({ user: 1 }, { unique: true });   // one cart per user
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
```

### Never Return Sensitive Fields
```typescript
// On User schema — strip from all JSON output
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.refreshToken;
    return ret;
  },
});
```

---

## DTO Validation Patterns

```typescript
// create DTO — full decorators
export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'Price in pence (integer). £29.99 = 2999' })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsMongoId()
  category: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  stock: number;
}

// update DTO — always PartialType
export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

---

## Error Handling

Always throw typed NestJS HTTP exceptions — never `throw new Error()`:
```typescript
throw new NotFoundException(`Product "${slug}" not found`);
throw new ConflictException('Email already registered');
throw new BadRequestException('Insufficient stock');
throw new ForbiddenException('Access denied');
throw new UnauthorizedException('Invalid credentials');
```

GlobalExceptionFilter formats all errors as:
```json
{ "statusCode": 404, "message": "Product not found", "timestamp": "..." }
```
Never leak stack traces — check `NODE_ENV` in the filter.

---

## Data Integrity Rules

### Prices as Integers
- Store ALL prices as integers (pence/cents): `£29.99 = 2999`
- Never use `parseFloat` or divide into the DB
- Divide by 100 only when formatting for display (on the frontend)

### Atomic Stock Decrement
```typescript
// ALWAYS use this — never read-then-write
const product = await this.productModel.findOneAndUpdate(
  { _id: productId, stock: { $gte: quantity } },
  { $inc: { stock: -quantity } },
  { new: true },
);
if (!product) throw new BadRequestException('Insufficient stock');
```

### Order Item Snapshot
Order items must embed product data at order time — not store refs:
```typescript
// In order schema items array — NOT ObjectId ref
items: [{
  productId: ObjectId,  // keep for reference
  name: String,         // snapshot
  price: Number,        // snapshot — price at purchase
  quantity: Number,
  imageUrl: String,     // snapshot
}]
```

---

## Security Rules

- JWT secret loaded from `process.env.JWT_SECRET` — no fallback default
- Refresh token stored as bcrypt hash in DB — not plain text
- Tokens set as httpOnly cookies — never in response body
- CORS locked to `process.env.FRONTEND_URL` — never `'*'`
- bcrypt minimum 12 rounds for passwords
- File uploads: validate MIME type server-side (jpeg, png, webp only)
- `ParseMongoIdPipe` on all `:id` params — prevents injection via malformed IDs
- Customers can only access their own cart and orders — always filter by `req.user._id`

---

## Code Style

- `interface` for object shapes, `type` for unions
- No `any` — use `unknown` or proper types
- `const` over `let`
- kebab-case filenames: `auth.service.ts`, `create-product.dto.ts`
- PascalCase classes: `ProductsService`, `JwtAuthGuard`
- Max 300 lines per file
- No comments explaining WHAT — only WHY when non-obvious
