import { ConfigModule } from '@nestjs/config';
import { AccessTokenStartegy } from './startegies/accessToken.startegy';
import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from './startegies/refreshToken.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({}),
    ConfigModule.forRoot(),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    AccessTokenStartegy,
    RefreshTokenStrategy,
    // UserService,
  ],
})
export class AuthenticationModule {}
