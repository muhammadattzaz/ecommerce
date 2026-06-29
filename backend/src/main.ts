import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser = require('cookie-parser');
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // Cookie parser — required for httpOnly JWT cookies
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger — available at /api (separate from /api/v1 routes)
  const config = new DocumentBuilder()
    .setTitle('ShopForge API')
    .setDescription('ShopForge e-commerce REST API — full documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('access_token')
    .addTag('Auth')
    .addTag('Products')
    .addTag('Categories')
    .addTag('Cart')
    .addTag('Orders')
    .addTag('Analytics')
    .addTag('Recommendations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 8000;
  await app.listen(port);
  console.log(`\n🚀  API        → http://localhost:${port}/api/v1`);
  console.log(`📚  Swagger    → http://localhost:${port}/api`);
  console.log(`🌐  Frontend   → http://localhost:3000\n`);
}
bootstrap();
