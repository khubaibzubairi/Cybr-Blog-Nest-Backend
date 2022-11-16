import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageController } from 'src/image/image.controller';
import { BlogPost, postDocument } from './blog-schema';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectModel(BlogPost.name) private postModel: Model<postDocument>,
  ) {}

  async createPost(post: BlogPost): Promise<postDocument> {
    post.image = ImageController.imagePath;
    return await this.postModel.create(post);
  }

  async getPost() {
    return await this.postModel.find();
  }

  async updatePost(id: string, post: BlogPost): Promise<postDocument> {
    const currentPost = this.postModel.findById(id);
    if (currentPost) {
      return await this.postModel.findByIdAndUpdate(id, post, { new: true });
    }
  }

  async deletePost(id: string) {
    const currentPost = this.postModel.findById(id);
    if (currentPost) {
      return await this.postModel.deleteOne({ _id: (await currentPost).id });
    }
  }
}
