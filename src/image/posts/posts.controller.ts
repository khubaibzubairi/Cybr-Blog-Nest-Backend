import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  static imagePath: string;

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './assets/posts/',
        filename: (req, file, cb) => {
          const filename: string = Array(10)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${filename}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Upload Image for Blog Post' })
  uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
    @Request() req,
  ) {
    PostsController.imagePath = `${file.filename}`;
    return { url: PostsController.imagePath.toString(), type: file.mimetype };
  }
}
