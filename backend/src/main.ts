import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

  // 🔥 Serve static folder untuk akses gambar (http://localhost:3001/uploads/xxx.jpg)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Pipe global untuk validasi DTO otomatis
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Deptech Stock API')
    .setDescription('API documentation for Deptech Stock Management')
    .setVersion('1.0')
    .addBearerAuth() // biar bisa test auth token di swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
