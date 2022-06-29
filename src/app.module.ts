import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BalanceModule } from './balance/balance.module';
import { ManagerModule } from './manager/manager.module';
import { OrderModule } from './order/order.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      logging: true
      // ssl: process.env.NODE_ENV
      //   ? {
      //       rejectUnauthorized: false
      //     }
      //   : false
    }),
    MulterModule.register({
      dest: './uploads'
    }),
    AuthModule,
    BalanceModule,
    SharedModule,
    OrderModule,
    UserModule,
    ManagerModule,
    AdminModule
  ],
  providers: [AppService],
  controllers: [AppController]
})
export class AppModule {}
