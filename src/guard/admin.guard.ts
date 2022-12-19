import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/schema/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let hasPermission: boolean = false;

    const request = context.switchToHttp().getRequest();

    const params = request.params;
    console.log('Params', params);

    const user = request.user.user;
    console.log('ReqUser', user);

    const dbUser: User = await this.userService.findOneById(user);
    console.log('DbUserId', dbUser._id);

    if (
      // dbUser._id == params.id ||
      // dbUser.firstname == params.author ||
      dbUser.role[0] == 1
    ) {
      hasPermission = true;
      return user && hasPermission;
    } else {
      throw new Error("403 Forbidden! You Don't Have Access");
    }
  }
}
