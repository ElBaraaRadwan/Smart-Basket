// src/cart/cart.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './entities/cart.entity';
import { AddCartItemInput, CreateCartInput, UpdateCartInput } from './dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productService: ProductService,
  ) {}

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartModel.findById(id).exec();
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  async findByUserId(userId: string): Promise<Cart> {
    let cart = await this.cartModel.findOne({ userId }).exec();
    return cart;
  }

  async create(createCartInput: CreateCartInput): Promise<Cart> {
    const newCart = new this.cartModel(createCartInput);
    return newCart.save();
  }

  async update(id: string, updateCartInput: UpdateCartInput): Promise<Cart> {
    const updatedCart = await this.cartModel
      .findByIdAndUpdate(id, updateCartInput, { new: true })
      .exec();

    if (!updatedCart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return updatedCart;
  }

  async addItem(
    cartId: string,
    addCartItemInput: AddCartItemInput,
  ): Promise<Cart> {
    // Verify the product exists
    const product = await this.productService.findOne(
      addCartItemInput.productId,
    );

    // Check if variant exists if variantId is provided
    if (addCartItemInput.variantId) {
      const variant = product.variants.find(
        (v) => v._id.toString() === addCartItemInput.variantId,
      );
      if (!variant) {
        throw new NotFoundException(
          `Variant with ID ${addCartItemInput.variantId} not found`,
        );
      }

      // Check if variant has enough stock
      if (variant.stock < addCartItemInput.quantity) {
        throw new BadRequestException(
          `Not enough stock available for this variant`,
        );
      }
    } else {
      // Check if product has enough stock
      if (product.stock < addCartItemInput.quantity) {
        throw new BadRequestException(
          `Not enough stock available for this product`,
        );
      }
    }

    // Get price from variant or product
    const price = addCartItemInput.variantId
      ? product.variants.find(
          (v) => v._id.toString() === addCartItemInput.variantId,
        ).price
      : product.salePrice || product.price;

    const cart = await this.findOne(cartId);

    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === addCartItemInput.productId &&
        item.variantId === addCartItemInput.variantId,
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += addCartItemInput.quantity;
    } else {
      // Add new item
      cart.items.push({
        productId: addCartItemInput.productId,
        quantity: addCartItemInput.quantity,
        variantId: addCartItemInput.variantId,
        price: price,
      });
    }

    return this.cartModel
      .findByIdAndUpdate(cartId, { items: cart.items }, { new: true })
      .exec();
  }

  async removeItem(
    cartId: string,
    productId: string,
    variantId?: string,
  ): Promise<Cart> {
    const cart = await this.findOne(cartId);

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          item.variantId === variantId
        ),
    );

    return this.cartModel
      .findByIdAndUpdate(cartId, { items: cart.items }, { new: true })
      .exec();
  }

  async updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number,
    variantId?: string,
  ): Promise<Cart> {
    const cart = await this.findOne(cartId);

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId && item.variantId === variantId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException(`Item not found in cart`);
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      return this.removeItem(cartId, productId, variantId);
    }

    // Verify stock availability
    const product = await this.productService.findOne(productId);

    if (variantId) {
      const variant = product.variants.find(
        (v) => v._id.toString() === variantId,
      );
      if (!variant) {
        throw new NotFoundException(`Variant with ID ${variantId} not found`);
      }

      if (variant.stock < quantity) {
        throw new BadRequestException(
          `Not enough stock available for this variant`,
        );
      }
    } else {
      if (product.stock < quantity) {
        throw new BadRequestException(
          `Not enough stock available for this product`,
        );
      }
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    return this.cartModel
      .findByIdAndUpdate(cartId, { items: cart.items }, { new: true })
      .exec();
  }

  async clearCart(cartId: string): Promise<Cart> {
    const updatedCart = await this.cartModel
      .findByIdAndUpdate(cartId, { items: [] }, { new: true })
      .exec();

    if (!updatedCart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    return updatedCart;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.cartModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }

  async calculateCartTotal(cartId: string): Promise<number> {
    const cart = await this.findOne(cartId);
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }
}
