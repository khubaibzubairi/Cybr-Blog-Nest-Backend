import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { User, userDocument } from '../schema/user.schema';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtservice: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
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

      return {
        user: newUser,
      };
    } else {
      throw new Error('Password does not Match');
    }
  }

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // cronlog() {
  //   console.log('TASK SCHEDULING WORKING');
  // }
  async signIn(data: LoginDto): Promise<any> {
    const user = await this.userService.findOneByUserName(data.username);
    console.log(user);

    const matchPassword = await bcrypt.compare(data.password, user.password);

    if (matchPassword) {
      const tokens = await this.getToken(user.id, user);

      const hashedRefToken = await this.updateRefreshToken(
        user._id,
        tokens.refreshToken,
      );
      return {
        Tokens: tokens,
        HashedRefToken: hashedRefToken.refreshToken,
      };
    } else {
      throw new Error('Access Denied');
    }
  }

  async logout(id: string) {
    return await this.userService.updateRefToken(id, { refreshToken: null });
  }

  async hashToken(token: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(token, saltOrRounds);
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashToken(refreshToken);

    return await this.userService.updateRefToken(id, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getToken(id: string, user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtservice.signAsync(
        {
          sub: id,
          user: user._id,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '30m',
        },
      ),
      this.jwtservice.signAsync(
        {
          sub: id,
          user: user._id,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '55m',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshToken(id: string, refreshToken: string) {
    const user = await this.userService.findOneById(id);
    console.log('RefToken User', user);

    const refreshTokenMatched = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    console.log('Token', refreshTokenMatched);

    if (refreshTokenMatched) {
      const token = await this.getToken(user._id, user);
      console.log(token);
      await this.updateRefreshToken(user._id, token.refreshToken);
      return {
        Tokens: token,
        msg: 'New Refreshed Token with 25 days Availability',
      };
    } else {
      throw new Error('Access Denied');
    }
  }
}
