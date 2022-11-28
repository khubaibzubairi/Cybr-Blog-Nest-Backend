import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post()
  async create(@Body() body: User): Promise<User> {
    if (body.password === body.confirmpassword) {
      const saltOrRounds = 10;
      const password = body.password;
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);
      body.password = hashedPassword;

      const confirmpassword = body.confirmpassword;
      const hashedConfirmPassword = await bcrypt.hash(
        confirmpassword,
        saltOrRounds,
      );

      body.confirmpassword = hashedConfirmPassword;

      return await this.authenticationService.create(body);
    } else {
      throw new Error('Password does not Match');
    }
  }
}
