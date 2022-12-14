import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/schema/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly service: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    console.log('Params', params);

    const user: User = request.user.user;

    const dbUser: User = await this.service.findOneById(user._id);
    console.log('DB', dbUser.firstname);
    console.log(params.id);
    console.log(user._id);
    console.log(dbUser._id);

    let hasPermission: boolean = false;
    if (dbUser._id == params.id || dbUser.firstname == params.author) {
      hasPermission = true;
      return user && hasPermission;
    } else {
      throw new Error("403 Forbidden! You Don't Have Access");
    }
  }
}
