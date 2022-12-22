import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { User } from 'src/schema/user.schema';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';

export type PayloadType = {
  id: string;
};
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let hasPermission: boolean = false;

    // console.log('TOKEN', AuthenticationService.jwtToken);

    // let token = AuthenticationService.jwtToken;
    // var { header, payload, signature } = jwt.decode(token.accessToken, {
    //   complete: true,
    // });
    // console.log('ID', payload.sub);

    const request = context.switchToHttp().getRequest();

    const params = request.params;

    console.log('REQ_USER', request.user);

    const user = request.user.user;
    console.log('ReqUser', user);

    const dbUser: User = await this.userService.findOneById(user);
    // console.log('DbUserId', dbUser._id);
    console.log('DbUserId', dbUser._id);

    if (params.id == dbUser._id) {
      throw new Error('Admin Can Not Ban Himself');
    } else if (dbUser._id == user && dbUser.role[0] == 1) {
      hasPermission = true;

      return user && hasPermission;
    } else {
      throw new Error("403 Forbidden! You Don't Have Access");
    }
  }
}
