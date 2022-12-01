import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost, postDocument } from './blog-schema';
import slugify from 'slugify';
import { PostsController } from 'src/image/posts/posts.controller';
import { User } from 'src/user/user.schema';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectModel(BlogPost.name) private postModel: Model<postDocument>,
  ) {}

  async create(author: User, post: BlogPost): Promise<postDocument> {
    post.slug = await this.generateSlug(post.title);
    post.author = author;
    // post.image = PostsController.imagePath;
    return await this.postModel.create(post);
  }

  async findAll(): Promise<postDocument[]> {
    return await this.postModel.find();
  }

  async find(query: BlogPost): Promise<postDocument[] | postDocument> {
    if (query.category) {
      return await this.postModel.find({ category: query.category });
    } else if (query.id) {
      return await this.postModel.findById({ _id: query.id });
    } else if (query.text) {
      return await this.postModel.find({ $text: { $search: query.text } });
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
