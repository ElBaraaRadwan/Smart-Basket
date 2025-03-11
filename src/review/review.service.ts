import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './entities/review.entity';
import { CreateReviewInput, UpdateReviewInput, ReviewFilterInput } from './dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(
    createReviewInput: CreateReviewInput,
    userId: string,
  ): Promise<Review> {
    const newReview = new this.reviewModel({
      ...createReviewInput,
      userId,
      createdAt: new Date(),
    });
    return await newReview.save();
  }

  async findAll(filterInput?: ReviewFilterInput): Promise<Review[]> {
    const filter = filterInput || {};
    return await this.reviewModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async findByProduct(productId: string): Promise<Review[]> {
    return await this.reviewModel.find({ productId, isVisible: true }).exec();
  }

  async findByUser(userId: string): Promise<Review[]> {
    return await this.reviewModel.find({ userId }).exec();
  }

  async update(
    id: string,
    updateReviewInput: UpdateReviewInput,
    userId: string,
  ): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Check if the user is the owner of the review
    if (review.userId.toString() !== userId) {
      throw new Error('You can only update your own reviews');
    }

    return await this.reviewModel
      .findByIdAndUpdate(id, { $set: updateReviewInput }, { new: true })
      .exec();
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const review = await this.reviewModel.findById(id).exec();

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Check if the user is the owner of the review
    if (review.userId.toString() !== userId) {
      throw new Error('You can only delete your own reviews');
    }

    const result = await this.reviewModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }

  async getAverageRating(productId: string): Promise<number> {
    const result = await this.reviewModel
      .aggregate([
        { $match: { productId, isVisible: true } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } },
      ])
      .exec();

    return result.length > 0
      ? parseFloat(result[0].averageRating.toFixed(1))
      : 0;
  }
}
