import {
  Body,
  Controller,
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
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @ApiProperty({ type: User })
  // @Post()
  // async create(@Body() body: User): Promise<User> {
  //   return await this.userService.create(body);
  // }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(): Promise<userDocument[]> {
    return await this.userService.findAll();
  }

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<userDocument> {
    return await this.userService.findOneByUserName(username);
  }

  @UseGuards(AccessTokenGuard)
  @Get('byId/:id')
  async findById(@Param('id') id: string): Promise<userDocument> {
    return await this.userService.findOneById(id);
  }

  @ApiBearerAuth('Jwt_Token')
  @ApiProperty({ type: User })
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

  @UseGuards(AccessTokenGuard)
  @Patch()
  async updateRefToken(
    @Param('id') id: string,
    @Body('body') body: Update_RefToken_UserDto,
  ) {
    return await this.userService.updateRefToken(id, body);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('makeadmin/:id')
  async makeAdmin(@Param('id') id: string): Promise<userDocument> {
    let updated = await this.userService.makeAdmin(id);
    console.log(updated);
    return updated;
  }

  @UseGuards(AccessTokenGuard)
  @Patch('dismissAsAdmin/:id')
  async dismissAsAdmin(@Param('id') id: string): Promise<userDocument> {
    let updated = await this.userService.dismissAsAdmin(id);
    console.log(updated);
    return updated;
  }

  @UseGuards(AccessTokenGuard)
  @Patch('banUser/:id')
  async banUser(@Param('id') id: string): Promise<userDocument> {
    return await this.userService.banUser(id);
  }
}
