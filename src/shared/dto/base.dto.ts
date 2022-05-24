import { validateOrReject } from 'class-validator';

export class BaseDTO {
  validate(): Promise<void> {
    return validateOrReject(this, {
      whitelist: true,
      forbidNonWhitelisted: true
    });
  }
}