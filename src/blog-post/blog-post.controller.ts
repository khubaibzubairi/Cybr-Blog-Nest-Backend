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
import { BlogPost, postDocument } from './blog-schema';
import * as fs from 'fs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiProperty,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guard/accessToken.guard';
import { UserDec } from 'src/decorator/user/user.decorator';
import { User, userDocument } from 'src/user/user.schema';
import { UserGuard } from 'src/guard/user.guard';
@ApiSecurity('basic')
@ApiTags('blog-posts')
@Controller('blog-posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @ApiBearerAuth('Jwt_Token')
  @ApiProperty({ type: BlogPost })
  @UseGuards(AccessTokenGuard, UserGuard)
  @Post()
  async create(@Request() req, @Body() post: BlogPost): Promise<BlogPost> {
    const user = req.user.user;
    return await this.blogPostService.create(user, post);
  }

  @ApiProperty()
  @Get('all')
  async findAll(): Promise<BlogPost[]> {
    // console.log(query);
    return await this.blogPostService.findAll();
  }

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
