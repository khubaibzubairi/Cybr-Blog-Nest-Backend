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
import { ApiTags } from '@nestjs/swagger';

ApiTags('blog-posts');
@Controller('blog-posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}
  @Post()
  async create(@Body() post: BlogPost): Promise<BlogPost> {
    return await this.blogPostService.create(post);
  }

  @Get()
  async get(): Promise<BlogPost[]> {
    return await this.blogPostService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BlogPost> {
    return await this.blogPostService.findOne(id);
  }
  @Get('categoryPosts/:category')
  async getbyCategory(
    @Param('category') category: string,
  ): Promise<BlogPost[]> {
    const cetegoryPosts = await this.blogPostService.getbyCategory(category);
    console.log(cetegoryPosts);
    return cetegoryPosts;
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() post: BlogPost,
  ): Promise<BlogPost> {
    const getpost = await this.blogPostService.getById(id);
    if (getpost) {
      return await this.blogPostService.updateOne(id, post);
    } else {
      throw new NotFoundException('POST NOT FOUND');
    }
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<any> {
    const getpost = await this.blogPostService.getById(id);
    if (getpost) {
      return await this.blogPostService.deleteOne(id);
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
