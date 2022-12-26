import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogPostModule } from './blog-post/blog-post.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PostsModule } from './image/posts/posts.module';
import { ProfileModule } from './image/profile/profile.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://0.0.0.0:27017/cybr-blog'),
    MongooseModule.forRoot(
      'mongodb+srv://cybr-blog-DB:1HsNYm3STTyHprNd@cluster0.awzjfmp.mongodb.net/cybr-blog?retryWrites=true&w=majority',
    ),
    BlogPostModule,

    PostsModule,
    ProfileModule,

    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'assets'),
        renderPath: 'assets',
      },
      {
        rootPath: join(__dirname, '..', 'assets/posts'),
        renderPath: '/posts',
      },
      {
        rootPath: join(__dirname, '..', 'assets/profile'),
        renderPath: '/profile',
      },
    ),

    AuthenticationModule,
    UserModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
