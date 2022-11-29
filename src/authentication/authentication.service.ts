import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, userDocument } from '../user/user.schema';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtservice: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async signUp(body: User): Promise<userDocument | any> {
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

      const newUser = await this.userService.create(body);

      const tokens = await this.getToken(newUser._id, newUser.username);
      console.log(typeof tokens);

      await this.updateRefreshToken(newUser._id, tokens.refreshToken);
      return {
        user: newUser,
        Tokens: tokens,
        HashedRefToken: newUser.refreshToken,
      };
    } else {
      throw new Error('Password does not Match');
    }
  }

  async signIn(data: User) {
    const user = await this.userService.findOneByUserName(data.username);
    console.log(user);

    const matchPassword = await bcrypt.compare(data.password, user.password);

    if (matchPassword) {
      const tokens = await this.getToken(user._id, user.username);
      await this.updateRefreshToken(user._id, tokens.refreshToken);
      return {
        Tokens: tokens,
        HashedRefToken: user.refreshToken,
      };
    } else {
      throw new Error('Access Denied');
    }
  }

  async logout(id: string) {
    return await this.userService.update(id, { refreshToken: null });
  }

  async hashToken(token: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(token, saltOrRounds);
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashToken(refreshToken);

    return await this.userService.update(id, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getToken(id: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtservice.signAsync(
        {
          sub: id,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtservice.signAsync(
        {
          sub: id,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshToken(id: string, refreshToken: string) {
    const user = await this.userService.findOneById(id);

    const refreshTokenMatched = await bcrypt.compare(
      user.refreshToken,
      refreshToken,
    );

    const token = await this.getToken(user._id, user.username);
    await this.updateRefreshToken(user._id, token.refreshToken);
    return {
      msg: 'New Refreshed Token with 7 days Availability',
      token: token,
    };
  }
}