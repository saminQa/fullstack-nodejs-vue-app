//CurrentUser decorator works together with CurrentUserInterceptor to tell the handler who the currently signin user is - we have to use interceptor, because of Dependency injection of UsersService. Decorator cannot go into the DI by itself

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // console.log('current-user decorator', request.currentUser);

    return request.currentUser;
  },
);
