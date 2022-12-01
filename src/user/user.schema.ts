import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { BlogPost } from 'src/blog-post/blog-schema';

export enum Role {
  USER = 0,
  ADMIN = 1,
}

@Schema({ timestamps: true })
export class User {
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

  @ApiProperty()
  @Prop({ required: true, default: Role.USER })
  role: Role[];

  @ApiProperty()
  @Prop()
  posts: BlogPost[];

  @ApiProperty()
  @Prop()
  refreshToken: string;
}

export const userSchema = SchemaFactory.createForClass(User);

export type userDocument = User & Document;
