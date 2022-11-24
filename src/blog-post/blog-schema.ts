import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class BlogPost {
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
  @Prop({ required: true })
  body: string;

  @ApiProperty({ type: String, description: 'The Image for a Blog Post' })
  @Prop({ required: true })
  image: string;

  @ApiProperty({
    type: String,
    description: 'The Slug Genereated from Ttile of the Blog Post',
  })
  @Prop({ required: true })
  slug: string;
}

export const postSchema = SchemaFactory.createForClass(BlogPost);

export type postDocument = BlogPost & Document;
