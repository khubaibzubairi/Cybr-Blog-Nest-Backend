import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogPostModule } from './blog-post/blog-post.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/cybr-blog'),
    BlogPostModule,
    ImageModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
