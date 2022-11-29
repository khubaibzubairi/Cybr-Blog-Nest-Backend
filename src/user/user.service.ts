import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfileController } from 'src/image/profile/profile.controller';
import { UserDto } from './user.dto';
import { User, userDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<userDocument>,
  ) {}

  async create(body: User): Promise<userDocument> {
    body.image = ProfileController.imagePath;
    return await this.userModel.create(body);
  }

  async findOneByUserName(username: string): Promise<userDocument> {
    return await this.userModel.findOne({ username: username });
  }

  async findOneById(id: string): Promise<userDocument> {
    return await this.userModel.findById({ _id: id });
  }

  async update(id: string, body: UserDto): Promise<userDocument> {
    return await this.userModel.findByIdAndUpdate(id, body, { new: true });
  }
}
