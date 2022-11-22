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

  async createPost(post: BlogPost): Promise<postDocument> {
    post.slug = await this.generateSlug(post.title);
    post.image = ImageController.imagePath;
    return await this.postModel.create(post);
  }

  async getPost() {
    return await this.postModel.find();
  }

  async updatePost(id: string, post: BlogPost): Promise<postDocument> {
    return await this.postModel.findByIdAndUpdate(id, post, { new: true });
  }

  async deletePost(id: string) {
    const currentPost = this.postModel.findById(id);
    if (currentPost) {
      return await this.postModel.deleteOne({ _id: (await currentPost).id });
    }
  }

  async byCategory(category: string): Promise<any> {
    return await this.postModel.find({ category });
  }

  async getById(id: string): Promise<postDocument> {
    return await this.postModel.findById(id);
  }
  async findOne(slug: string): Promise<postDocument> {
    return await this.postModel.findOne({ slug: slug });
  }
  async generateSlug(title: string): Promise<string> {
    // return await slugify(title.slice(1, 3) + join('-') + title);
    return slugify(title);
  }
}
