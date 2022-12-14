import { Module, forwardRef } from '@nestjs/common';
import { AdminAuthService } from './admin.auth.service';
import { AdminAuthController } from './admin.auth.controller';
import { AdminModule } from 'src/admin/admin.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AdminModule, JwtModule.register({}), ConfigModule.forRoot()],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
