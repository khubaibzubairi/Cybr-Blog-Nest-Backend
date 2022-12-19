import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { BlogPost } from 'src/schema/blog.schema';

export enum Role {
  USER = 0,
  ADMIN = 1,
  BAN = 2,
}

@Schema({ timestamps: true })
export class User {
  _id: string;

  @ApiProperty()
  @Prop({ required: true })
  firstname: string;

  @ApiProperty()
  @Prop({ required: true })
  lastname: string;

  @ApiProperty()
  @Prop({ required: true })
  username: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  password: string;

  @ApiProperty()
  @Prop({ required: true })
  confirmpassword: string;

  @ApiProperty()
  @Prop()
  image: string;

  @ApiProperty({ required: true, default: Role.USER })
  @Prop({ required: true, default: Role.USER })
  role: Role[];

  @ApiProperty()
  @Prop()
  posts: BlogPost[];

  @ApiProperty()
  @Prop()
  refreshToken: string;

  @ApiProperty()
  @Prop()
  isActive: boolean;
}

export const userSchema = SchemaFactory.createForClass(User);

export type userDocument = User & Document;
