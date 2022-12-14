import { Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { LoginDto } from 'src/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { AdminDto } from 'src/dto/admin.dto';
import { Admin } from 'src/schema/admin.schema';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwtservice: JwtService,
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
  ) {}

  async login(credentials: LoginDto): Promise<any> {
    let admin = await this.adminService.findByUsername(credentials.username);
    console.log('Admin', admin);

    let matchPassord = await bcrypt.compare(
      credentials.password,
      admin.password,
    );

    if (matchPassord) {
      const token = await this.getToken(admin._id, admin);
      console.log(token);
      await this.updateRefreshToken(admin._id, token.refreshToken);
      return {
        Tokens: token,
        msg: 'New Refreshed Token with 25 days Availability',
      };
    } else {
      throw new Error('Access Denied');
    }
  }

  async hashToken(token: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(token, saltOrRounds);
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashToken(refreshToken);

    return await this.adminService.updateRefToken(id, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getToken(id: string, user: Admin) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtservice.signAsync(
        {
          sub: id,
          user: user._id,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '30s',
        },
      ),
      this.jwtservice.signAsync(
        {
          sub: id,
          user: user._id,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '5m',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshToken(id: string, refreshToken: string) {
    const admin = await this.adminService.findOneById(id);
    console.log('RefToken User', admin);

    const refreshTokenMatched = await bcrypt.compare(
      refreshToken,
      admin.refreshToken,
    );
    console.log('Token', refreshTokenMatched);

    if (refreshTokenMatched) {
      const token = await this.getToken(admin._id, admin);
      console.log(token);
      await this.updateRefreshToken(admin._id, token.refreshToken);
      return {
        Tokens: token,
        msg: 'New Refreshed Token with 25 days Availability',
      };
    } else {
      throw new Error('Access Denied');
    }
  }
}
