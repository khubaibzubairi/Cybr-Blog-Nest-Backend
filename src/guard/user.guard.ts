import { userDocument } from './../user/user.schema';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly service: UserService) {}

  // hasPermission: boolean = false;
  // dbUser:User

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const user: User = request.user.user;

    console.log('USER FROM REQUEST', user);

    console.log('Params ID', params.id);

    const dbUser: User = await this.service.findOneById(user._id);
    console.log('DB USER ID', dbUser._id);
    let hasPermission = false;
    if (dbUser._id == params.id) {
      console.log('IT WORKS TILL HERE');

      hasPermission = true;

      console.log('IT WORKS TILL HERE AS WELL');
    }
    return user && hasPermission;
  }
}
