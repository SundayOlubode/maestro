import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

/**
 * CUSTOM DECORATOR TO GET USER FROM REQUEST
 * @param data
 * @return {User: Express.User | null}
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();

    const user = request['user'];
    return user ? user : null;
  },
);
