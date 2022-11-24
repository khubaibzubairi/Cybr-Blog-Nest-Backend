import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageController } from 'src/image/image.controller';
import { BlogPost, postDocument } from './blog-schema';
import slugify from 'slugify';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectModel(BlogPost.name) private postModel: Model<postDocument>,
  ) {}

  async create(post: BlogPost): Promise<postDocument> {
    post.slug = await this.generateSlug(post.title);
    post.image = ImageController.imagePath;
    return await this.postModel.create(post);
  }

  async find(query: BlogPost): Promise<postDocument[] | postDocument> {
    if (query.category) {
      return await this.postModel.find({ category: query.category });
    } else if (query.id) {
      return await this.postModel.findById({ _id: query.id });
    } else {
      return await this.postModel.find();
    }
  }

  async updateOne(id: string, post: BlogPost): Promise<postDocument> {
    return await this.postModel.findByIdAndUpdate(id, post, { new: true });
  }

  async deleteOne(id: string): Promise<unknown> {
    const currentPost = this.postModel.findById(id);
    if (currentPost) {
      return await this.postModel.deleteOne({ _id: (await currentPost).id });
    }
  }

  async getById(id: string): Promise<postDocument> {
    return await this.postModel.findById(id);
  }
  async generateSlug(title: string): Promise<string> {
    // return await slugify(title.slice(1, 3) + join('-') + title);
    return slugify(title);
  }
}
