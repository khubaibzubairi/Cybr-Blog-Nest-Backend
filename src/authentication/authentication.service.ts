import { ProfileController } from './../image/profile/profile.controller';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, userDocument } from './user.schema';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<userDocument>,
  ) {}

  async create(body: User): Promise<userDocument> {
    body.image = ProfileController.imagePath;
    return await this.userModel.create(body);
  }
}
