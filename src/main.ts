import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import basicAuth from 'express-basic-auth';
import { ValidationPipe } from '@nestjs/common';
import { MarketDto } from './manager/dto/market.dto';
import { PhotoDto } from './shared/dto/photo.dto';
import { UserRolesDto } from './user/dto/user.roles.dto';
import { BalanceDto } from './balance/dto/balance.dto';
import { UserDto } from './user/dto/user.dto';
import { ManagerDto } from './manager/dto/manager.dto';

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
    extraModels: [
      MarketDto,
      PhotoDto,
      UserRolesDto,
      BalanceDto,
      UserDto,
      ManagerDto
    ]
  });
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha'
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  await app.listen(process.env.PORT || 3000, process.env.HOST || 'localhost');
}

bootstrap();
