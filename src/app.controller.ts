import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  testConnection(): void {
    return this.appService.testApplication();
  }
}
