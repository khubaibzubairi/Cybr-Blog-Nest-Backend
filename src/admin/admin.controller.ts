import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AdminDto } from 'src/dto/admin.dto';
import { adminDocument } from 'src/schema/admin.schema';
import { AdminService } from './admin.service';
import * as bcrypt from 'bcrypt';
@ApiTags('admin')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(@Body() body: AdminDto): Promise<adminDocument> {
    const saltOrRounds = 10;
    const hashedpassword = bcrypt.hash(body.password, saltOrRounds);
    body.password = await hashedpassword;

    let admin = await this.adminService.create(body);
    console.log('Admin', admin);
    return admin;
  }

  @Get(':username')
  async findByUsername(
    @Param('username') username: string,
  ): Promise<adminDocument> {
    let admin = await this.adminService.findByUsername(username);
    console.log('Admin By UserName', admin);
    return admin;
  }
}
