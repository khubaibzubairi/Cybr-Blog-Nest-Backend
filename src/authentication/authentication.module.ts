import { ConfigModule } from '@nestjs/config';
import { AccessTokenStartegy } from './startegies/accessToken.startegy';
import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from './startegies/refreshToken.strategy';
import { UserModule } from 'src/user/user.module';
import { AdminAuthModule } from 'src/authentication/adminAuth/admin.auth.module';

@Module({
  imports: [
    // forwardRef(() => UserModule),
    UserModule,

    JwtModule.register({}),
    ConfigModule.forRoot(),

    AdminAuthModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AccessTokenStartegy, RefreshTokenStrategy],
})
export class AuthenticationModule {}
