import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly service: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;

    const user: User = request.user.user;

    const dbUser: User = await this.service.findOneById(user._id);
    let hasPermission: boolean = false;
    if (dbUser._id == params.id) {
      hasPermission = true;
      return user && hasPermission;
    } else {
      throw new Error("403 Forbidden! You Don't Have Access");
    }
  }
}
