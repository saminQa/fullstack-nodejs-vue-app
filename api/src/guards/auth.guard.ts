import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    //console.log('AuthGuard - session', request.session);

    return request.session.userId;
  }
}

// USE IN  CONTROLLER OR CONCRETE HANDLER LIKE THIS:

// import {UseGuards} from '@nestjs/common';
// import { AuthGuard } from 'src/guards/auth.guard';

// @Get('/whoami')
// @UseGuards(AuthGuard) --------- TU JE POUZITY TENTO GUARD
// whoAmI(@CurrentUser() user: User) {
//   return user;
// }
