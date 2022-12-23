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
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPost, postDocument } from '../schema/blog.schema';
import * as fs from 'fs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiProperty,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guard/accessToken.guard';
import { UserGuard } from 'src/guard/user.guard';
import { AdminGuard } from 'src/guard/admin.guard';
@ApiSecurity('basic')
@ApiTags('Blog-Posts')
@Controller('blog-posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @ApiBearerAuth('Jwt_Token')
  @ApiProperty({ type: BlogPost })
  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Request() req, @Body() post: BlogPost): Promise<BlogPost> {
    const user = req.user.user;

    return await this.blogPostService.create(user, post);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get('count')
  async count(): Promise<number> {
    let postsCounted = await this.blogPostService.count();
    console.log(postsCounted);
    return postsCounted;
  }

  // @ApiProperty()
  // @Get('all')
  // async findAll(): Promise<BlogPost[]> {
  //   return await this.blogPostService.findAll();
  // }

  @ApiProperty()
  @UseGuards(AccessTokenGuard, UserGuard)
  @Get(':author')
  async findByAuthor(@Param('author') author: string): Promise<postDocument[]> {
    const posts = await this.blogPostService.findByAuthor(author);
    return posts;
  }

  @ApiProperty()
  @Get()
  async get(@Query() query: BlogPost): Promise<BlogPost[] | BlogPost> {
    console.log(query);
    return await this.blogPostService.find(query);
  }

  @ApiBearerAuth('Jwt_Token')
  @ApiProperty({ type: BlogPost })
  @UseGuards(AccessTokenGuard, UserGuard)
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

  @ApiProperty()
  @UseGuards(AccessTokenGuard, UserGuard)
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

  @UseGuards(AccessTokenGuard, UserGuard)
  @Delete('server/:filename')
  async fromDiskStorage(@Param('filename') filename: string) {
    fs.unlink(`./assets/${filename}`, (error) => {
      if (error) {
        console.log(error);
        return error;
      }
    });
  }

  @Get('userPosts/:id')
  async findUserPosts(@Param('id') id: string): Promise<postDocument[]> {
    let posts = await this.blogPostService.findUserPosts(id);
    if (posts) {
      console.log(posts);
      return posts;
    } else {
      console.log('NO POSTS FOUND FOR THIS USER');
    }
  }
}
