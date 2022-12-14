import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User, userDocument } from '../schema/user.schema';
import { UserService } from './user.service';
import { Update_RefToken_UserDto } from '../dto/updateRefToken.dto';
import { AccessTokenGuard } from 'src/guard/accessToken.guard';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'src/guard/user.guard';
import { AdminGuard } from 'src/guard/admin.guard';
import * as fs from 'fs';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @ApiProperty({ type: User })
  // @Post()
  // async create(@Body() body: User): Promise<User> {
  //   return await this.userService.create(body);
  // }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get('count')
  async count(): Promise<number> {
    let counted = await this.userService.count();
    console.log(counted);
    return counted;
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get()
  async findAll(): Promise<userDocument[]> {
    return await this.userService.findAll();
  }

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<userDocument> {
    return await this.userService.findOneByUserName(username);
  }

  @Get('byId/:id')
  async findById(@Param('id') id: string): Promise<userDocument> {
    return await this.userService.findOneById(id);
  }

  @ApiBearerAuth('Jwt_Token')
  @UseGuards(AccessTokenGuard, UserGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: User,
  ): Promise<userDocument> {
    const updated = await this.userService.update(id, body);
    console.log(updated);

    return updated;
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Patch('makeadmin/:id')
  async makeAdmin(@Param('id') id: string): Promise<userDocument> {
    let updated = await this.userService.makeAdmin(id);
    console.log(updated);
    return updated;
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Patch('dismissAsAdmin/:id')
  async dismissAsAdmin(@Param('id') id: string): Promise<userDocument> {
    let updated = await this.userService.dismissAsAdmin(id);
    console.log(updated);
    return updated;
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Patch('banUser/:id')
  async banUser(@Param('id') id: string): Promise<userDocument> {
    return await this.userService.banUser(id);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Delete('deleteAll')
  async deleteAll(): Promise<any> {
    let deleted = await this.userService.delteAll();
    console.log(deleted);
    return deleted;
  }

  @Patch('removeUserImage/:id')
  async removeUserPhoto(@Param('id') id: string): Promise<userDocument> {
    let updated = await this.userService.removeUserPhoto(id);
    console.log(updated);
    return updated;
  }

  @UseGuards(AccessTokenGuard, UserGuard)
  @Delete('server/:filename')
  async fromDiskStorage(@Param('filename') filename: string) {
    fs.unlink(`./assets/profile/${filename}`, (error) => {
      if (error) {
        console.log(error);
        return error;
      }
    });
  }
}
