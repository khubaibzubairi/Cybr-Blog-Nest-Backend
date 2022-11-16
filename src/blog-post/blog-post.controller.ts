import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPost } from './blog-schema';

@Controller('blog-post')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}
  @Post()
  async create(@Body() post: BlogPost) {
    return await this.blogPostService.createPost(post);
  }

  @Get()
  async get() {
    return await this.blogPostService.getPost();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() post: BlogPost) {
    const getpost = await this.blogPostService.getById(id);
    if (getpost) {
      return await this.blogPostService.updatePost(id, post);
    } else {
      throw new NotFoundException('POST NOT FOUND');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.blogPostService.deletePost(id);
  }
}
