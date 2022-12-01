import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.schema';

@Schema({ timestamps: true })
export class BlogPost {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: String, description: 'The title of the Blog Post' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ type: String, description: 'The Category of the Blog Post' })
  @Prop({ required: true })
  category: string;

  @ApiProperty({
    type: String,
    description: 'The Entire Story/Body of the Blog Post',
  })
  @Prop({ required: true, index: true })
  body: string;

  @ApiProperty({ type: String, description: 'The Image for a Blog Post' })
  @Prop({ required: true })
  image: string;

  // @ApiProperty({
  //   type: String,
  //   description: 'The Slug Genereated from Ttile of the Blog Post',
  // })
  @Prop({ required: true })
  slug: string;

  @ApiProperty({ required: true })
  @Prop()
  author: User;

  @Prop()
  text: string;
}

export const postSchema = SchemaFactory.createForClass(BlogPost);
postSchema.index({ body: 'text' });

export type postDocument = BlogPost & Document;
