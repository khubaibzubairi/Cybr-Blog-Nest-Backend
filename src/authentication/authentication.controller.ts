import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { User, userDocument } from '../user/user.schema';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/guard/accessToken.guard';
import { RefreshTokenGuard } from 'src/guard/refreshToken.guard';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './login.dto';
@ApiTags('Auth')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async signUp(@Body() body: User): Promise<userDocument> {
    return await this.authenticationService.signUp(body);
  }

  @ApiProperty({ type: LoginDto })
  @Post('login')
  async signIn(@Body() body: LoginDto) {
    return await this.authenticationService.signIn(body);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request) {
    const logged = await this.authenticationService.logout(req.user['sub']);
    return {
      msg: 'Logged Out User',
      User: logged,
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(@Req() req: Request) {
    const id = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return await this.authenticationService.refreshToken(id, refreshToken);
  }
}
