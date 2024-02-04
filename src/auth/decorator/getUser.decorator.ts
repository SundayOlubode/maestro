// import {
//   createParamDecorator,
//   ExecutionContext,
// } from '@nestjs/common';

// export const GetUser = createParamDecorator(
//   (data: string | undefined, ctx: ExecutionContext) => {
//     const request: Express.Request = ctx.switchToHttp().getRequest();
//     console.log('request user', request['user']);

//     if (request.user) {
//       return request.user[data];
//     }
//     return null;
//   },
// );

import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();

    const user = request['user'];
    if (user) {
      return user;
    }
    return null;
  },
);
