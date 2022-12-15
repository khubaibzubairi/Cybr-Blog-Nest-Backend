import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Role } from './user.schema';
Document;

@Schema({ timestamps: true })
export class Admin {
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

  @ApiProperty()
  @Prop({ required: true, default: Role.ADMIN })
  role: Role[];

  @ApiProperty()
  @Prop()
  refreshToken: string;
}

export const adminSchema = SchemaFactory.createForClass(Admin);
export type adminDocument = Admin & Document;
