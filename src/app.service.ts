import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  testApplication(): string {
    console.log('Hello World!!!');
    return 'Hello World';
  }
}
