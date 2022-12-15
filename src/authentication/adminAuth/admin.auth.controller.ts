import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/dto/login.dto';
import { AdminAuthService } from './admin.auth.service';

@Controller('adminauth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  // @Post('login')
  // async login(@Body() credential: LoginDto): Promise<any> {
  //   return await this.adminAuthService.login(credential);
  // }
}
