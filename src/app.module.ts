import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BalanceModule } from './balance/balance.module';
import { ManagerModule } from './manager/manager.module';
import { OrderModule } from './order/order.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

const { DB_PORT, DB_HOST, DB_USER, DB_NAME, DB_PASSWORD } = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: +DB_PORT,
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      autoLoadEntities: true,
      logging: true
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
