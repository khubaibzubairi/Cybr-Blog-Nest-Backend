import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../schema/user.schema';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { AdminModule } from 'src/admin/admin.module';
import { AdminService } from 'src/admin/admin.service';

@Module({
  imports: [
    // forwardRef(() => AuthenticationModule),
    forwardRef(() => {
      AdminModule;
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AdminService],
  exports: [UserService],
})
export class UserModule {}
