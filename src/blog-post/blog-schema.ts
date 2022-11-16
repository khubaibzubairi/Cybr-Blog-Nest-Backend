import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class BlogPost {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  category: string;
  @Prop({ required: true })
  body: string;
  @Prop({ required: true })
  image: string;
  // @Prop({required: true})
  // author: string
}

export const postSchema = SchemaFactory.createForClass(BlogPost);

export type postDocument = BlogPost & Document;
