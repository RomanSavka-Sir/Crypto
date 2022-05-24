import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  testApplication(): void {
    console.log('Hello World');
  }
}
