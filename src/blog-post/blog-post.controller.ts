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
import {
  ApiCreatedResponse,
  ApiProperty,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
@ApiSecurity('basic')
@ApiTags('blog-posts')
@Controller('blog-posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: BlogPost,
  })
  @ApiProperty({ type: BlogPost })
  @Post()
  async create(@Body() post: BlogPost): Promise<BlogPost> {
    return await this.blogPostService.create(post);
  }

  @ApiProperty({ type: [BlogPost] })
  @Get()
  async get(): Promise<BlogPost[]> {
    return await this.blogPostService.findAll();
  }

  @ApiProperty({ type: BlogPost })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BlogPost> {
    return await this.blogPostService.findOne(id);
  }

  @ApiProperty({ type: [BlogPost] })
  @Get('categoryPosts/:category')
  async getbyCategory(
    @Param('category') category: string,
  ): Promise<BlogPost[]> {
    const cetegoryPosts = await this.blogPostService.getbyCategory(category);
    console.log(cetegoryPosts);
    return cetegoryPosts;
  }

  @ApiProperty({ type: BlogPost })
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
  async deleteOne(@Param('id') id: string): Promise<unknown> {
    const getpost = await this.blogPostService.getById(id);
    if (getpost) {
      const deletedpost = await this.blogPostService.deleteOne(id);
      console.log('Post with Id ' + id + ' is deleted');
      return deletedpost;
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
