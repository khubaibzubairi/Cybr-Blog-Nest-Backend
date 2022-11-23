import {
  Controller,
  Post,
  UploadedFile,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  static imagePath: string;

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './assets/',
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
  uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
    @Request() req,
  ) {
    ImageController.imagePath = `${file.filename}`;
    return { url: ImageController.imagePath.toString(), type: file.mimetype };
  }
}
