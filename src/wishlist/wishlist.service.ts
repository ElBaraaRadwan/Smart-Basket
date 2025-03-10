// src/wishlist/wishlist.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './entities/wishlist.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
    private productService: ProductService,
  ) {}

  async getWishlistById(id: string): Promise<Wishlist> {
    const wishlist = await this.wishlistModel.findById(id).exec();

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    return wishlist;
  }

  async getWishlist(userId: string): Promise<WishlistDocument> {
    let wishlist = await this.wishlistModel.findOne({ userId });

    if (!wishlist) {
      wishlist = new this.wishlistModel({ userId, productIds: [] });
      await wishlist.save();
    }

    return wishlist;
  }

  async addToWishlist(
    userId: string,
    productId: string,
  ): Promise<WishlistDocument> {
    // Check if product exists
    const product = await this.productService.findOne(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Get or create wishlist
    const wishlist = await this.getWishlist(userId);

    // Add product if not already in wishlist
    if (!wishlist.productIds.includes(productId)) {
      wishlist.productIds.push(productId);
      return wishlist.save();
    }

    return wishlist;
  }

  async removeFromWishlist(
    userId: string,
    productId: string,
  ): Promise<Wishlist> {
    const wishlist = await this.getWishlist(userId);

    // Remove product from wishlist
    wishlist.productIds = wishlist.productIds.filter(
      (id) => id.toString() !== productId,
    );

    return wishlist.save();
  }

  async clearWishlist(userId: string): Promise<Wishlist> {
    const wishlist = await this.getWishlist(userId);

    wishlist.productIds = [];

    return wishlist.save();
  }
}
