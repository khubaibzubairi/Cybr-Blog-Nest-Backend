import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User, userDocument } from './user.schema';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from './user.dto';
import { AccessTokenGuard } from 'src/guard/accessToken.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: User): Promise<User> {
    return await this.userService.create(body);
  }

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<userDocument> {
    return await this.userService.findOneByUserName(username);
  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  async update(@Param('id') id: string, @Body('body') body: UserDto) {
    return await this.userService.update(id, body);
  }
}
