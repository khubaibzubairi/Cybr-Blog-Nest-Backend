import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

  @Put(':id')
  async update(@Param('id') id: string, @Body() post: BlogPost) {
    return await this.blogPostService.updatePost(id, post);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.blogPostService.deletePost(id);
  }
}
