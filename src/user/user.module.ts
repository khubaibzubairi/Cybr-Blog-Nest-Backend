import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../schema/user.schema';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { BlogPostModule } from 'src/blog-post/blog-post.module';
import { PostsModule } from 'src/image/posts/posts.module';

@Module({
  imports: [
    PostsModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
