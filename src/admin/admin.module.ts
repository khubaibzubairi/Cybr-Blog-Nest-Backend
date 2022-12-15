import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, adminSchema } from 'src/schema/admin.schema';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    forwardRef(() => {
      return UserModule;
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, UserService],
  exports: [AdminService],
})
export class AdminModule {}
