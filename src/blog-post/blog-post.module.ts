import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPost, postSchema } from '../schema/blog.schema';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: BlogPost.name,
        schema: postSchema,
      },
    ]),
  ],
  controllers: [BlogPostController],
  providers: [BlogPostService],
  exports: [BlogPostService],
})
export class BlogPostModule {}
