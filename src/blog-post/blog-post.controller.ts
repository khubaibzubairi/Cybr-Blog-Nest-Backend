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
import * as fs from 'fs';

@Controller('blog-post')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}
  @Post()
  async create(@Body() post: BlogPost): Promise<BlogPost> {
    return await this.blogPostService.createPost(post);
  }

  @Get()
  async get(): Promise<BlogPost[]> {
    return await this.blogPostService.getPost();
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BlogPost> {
    return await this.blogPostService.findOne(id);
  }
  @Get('categoryPosts/:category')
  async byCategory(@Param('category') category: string): Promise<BlogPost[]> {
    const cetegoryPosts = await this.blogPostService.byCategory(category);
    console.log(cetegoryPosts);
    return cetegoryPosts;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() post: BlogPost,
  ): Promise<BlogPost> {
    const getpost = await this.blogPostService.getById(id);
    if (getpost) {
      return await this.blogPostService.updatePost(id, post);
    } else {
      throw new NotFoundException('POST NOT FOUND');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    const getpost = await this.blogPostService.getById(id);
    if (getpost) {
      return await this.blogPostService.deletePost(id);
    } else {
      throw new NotFoundException('THERE IS NO SUVH POST YOU WANT TO DELETE');
    }
  }
  @Delete('server/:filename')
  async fromDiskStorage(@Param('filename') filename: string) {
    fs.unlink(`./assets/${filename}`, (error) => {
      if (error) {
        console.log(error);
        return error;
      }
    });
  }
}
