import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminDto } from 'src/dto/admin.dto';
import { Update_RefToken_AdminDto } from 'src/dto/updateRefToken.dto';
import { Admin, adminDocument } from 'src/schema/admin.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<adminDocument>,
  ) {}

  async create(body: AdminDto): Promise<adminDocument> {
    return await this.adminModel.create(body);
  }

  async findByUsername(username: string): Promise<adminDocument> {
    return await this.adminModel.findOne({ username: username });
  }

  async findOneById(id: string): Promise<adminDocument> {
    return await this.adminModel.findById({ _id: id });
  }

  async updateRefToken(
    id: string,
    body: Update_RefToken_AdminDto,
  ): Promise<adminDocument> {
    return await this.adminModel.findByIdAndUpdate(id, body, { new: true });
  }
}
