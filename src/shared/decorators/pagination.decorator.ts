import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomParamFactory } from '@nestjs/common/interfaces/features/custom-route-param-factory.interface';

export const Pagination = createParamDecorator(
  (_1: CustomParamFactory, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const limit = +request.query.limit || 1;
    const offset = +request.query.offset || 0;

    return {
      limit,
      offset
    };
  }
);
