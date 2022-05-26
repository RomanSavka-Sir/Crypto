import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import basicAuth from 'express-basic-auth';
import { ValidationPipe } from '@nestjs/common';
import { MarketDto } from './manager/dto/market.dto';
import { PhotoDto } from './shared/dto/photo.dto';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api');

  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD
      }
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Crypto')
    .setDescription('The crypto API description')
    .setVersion('1.0')
    .addTag('crypto')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      'accessToken'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [MarketDto, PhotoDto]
  });
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  await app.listen(process.env.PORT, process.env.HOST);
}

bootstrap();
