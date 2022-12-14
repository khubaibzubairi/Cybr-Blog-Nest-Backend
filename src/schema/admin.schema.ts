import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Role } from './user.schema';
Document;

@Schema({ timestamps: true })
export class Admin {
  _id: string;

  @ApiProperty({ required: true })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ required: true })
  @Prop({ required: true })
  username: string;

  @ApiProperty({ required: true })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ required: true })
  @Prop({ required: true })
  image: string;

  @ApiProperty({ required: true })
  @Prop({ required: true, default: Role.ADMIN })
  role: Role[];

  @ApiProperty()
  @Prop()
  refreshToken: string;
}

export const adminSchema = SchemaFactory.createForClass(Admin);
export type adminDocument = Admin & Document;
