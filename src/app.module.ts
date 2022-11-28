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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/cybr-blog'),
    BlogPostModule,

    PostsModule,
    ProfileModule,

    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'assets/profile'),
        // serveRoot: '/assets',
      },
      {
        rootPath: join(__dirname, '..', 'assets/posts'),
        // serveRoot: '/assets',
      },
    ),
    // ServeStaticModule.forRoot(
    //   // {
    //   //   rootPath: join(__dirname, '..', 'assets/posts'),
    //   //   // serveRoot: '/assets',
    //   // },
    //   {
    //     rootPath: join(__dirname, '..', 'assets/profile'),
    //     // serveRoot: '/assets',
    //   },
    // ),

    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
