import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, trusted } from 'mongoose';
import { ProfileController } from 'src/image/profile/profile.controller';
import { Update_RefToken_UserDto } from '../dto/updateRefToken.dto';
import { User, userDocument } from '../schema/user.schema';
import { CronJob } from 'cron';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<userDocument>,
    private scheduler: SchedulerRegistry,
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

  async update(id: string, body: User): Promise<userDocument> {
    return await this.userModel.findByIdAndUpdate(id, body, { new: true });
  }

  async updateRefToken(
    id: string,
    body: Update_RefToken_UserDto,
  ): Promise<userDocument> {
    return await this.userModel.findByIdAndUpdate(id, body, { new: true });
  }

  async makeAdmin(id: string): Promise<userDocument> {
    let user = await this.userModel.findById({ _id: id });
    if (user) {
      user.role[0] = 1;
      return await this.userModel.findByIdAndUpdate(user.id, user, {
        new: true,
      });
    }
  }

  async dismissAsAdmin(id: string): Promise<userDocument> {
    let user = await this.userModel.findById({ _id: id });
    if (user) {
      user.role[0] = 0;
      return await this.userModel.findByIdAndUpdate(user.id, user, {
        new: true,
      });
    }
  }

  // @Cron('* * * * * *')
  async banUser(id: string): Promise<userDocument> {
    let banRemoved: userDocument;
    let banned: userDocument;

    let user: User = await this.userModel.findById({ _id: id });

    user.role[0] = 2;

    banned = await this.userModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });

    console.log('Baned User', banned);

    const job = new CronJob(CronExpression.EVERY_10_SECONDS, async () => {
      let user: User = await this.userModel.findById({ _id: id });

      user.role[0] = 0;

      banRemoved = await this.userModel.findByIdAndUpdate(user._id, user, {
        new: true,
      });

      console.log('Revoked', banRemoved);
    });

    this.scheduler.addCronJob('name', job);
    job.start();

    setTimeout(() => {
      job.stop();
    }, 10100);

    return banRemoved;
  }
}
