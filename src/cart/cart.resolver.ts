// src/cart/cart.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { UserService } from '../user/user.service';
import { Cart } from './entities/cart.entity';
import { User } from '../user/entities/user-entity';
import {
  CreateCartInput,
  CartTotalOutput,
  AddCartItemInput,
  UpdateCartInput,
} from './dto';
import { GqlAuthGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';

@Resolver(() => Cart)
export class CartResolver {
  constructor(
    private cartService: CartService,
    private userService: UserService,
  ) {}

  @Query(() => Cart)
  @UseGuards(GqlAuthGuard)
  async myCart(@CurrentUser() user) {
    return this.cartService.findByUserId(user._id);
  }

  @Query(() => Cart)
  @UseGuards(GqlAuthGuard)
  async cart(@Args('id', { type: () => ID }) id: string) {
    return this.cartService.findOne(id);
  }

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard)
  async createCart(@Args('input') createCartInput: CreateCartInput) {
    return this.cartService.create(createCartInput);
  }

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard)
  async updateCart(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateCartInput: UpdateCartInput,
  ) {
    return this.cartService.update(id, updateCartInput);
  }

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard)
  async addCartItem(
    @Args('cartId', { type: () => ID }) cartId: string,
    @Args('input') addCartItemInput: AddCartItemInput,
  ) {
    return this.cartService.addItem(cartId, addCartItemInput);
  }

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard)
  async addItemToMyCart(
    @CurrentUser() user,
    @Args('input') addCartItemInput: AddCartItemInput,
  ) {
    const cart = await this.cartService.findByUserId(user._id);
    return this.cartService.addItem(cart._id, addCartItemInput);
  }

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard)
  async removeCartItem(
    @Args('cartId', { type: () => ID }) cartId: string,
    @Args('productId', { type: () => ID }) productId: string,
    @Args('variantId', { type: () => ID, nullable: true }) variantId?: string,
  ) {
    return this.cartService.removeItem(cartId, productId, variantId);
  }

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard)
  async updateCartItemQuantity(
    @Args('cartId', { type: () => ID }) cartId: string,
    @Args('productId', { type: () => ID }) productId: string,
    @Args('quantity') quantity: number,
    @Args('variantId', { type: () => ID, nullable: true }) variantId?: string,
  ) {
    return this.cartService.updateItemQuantity(
      cartId,
      productId,
      quantity,
      variantId,
    );
  }

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard)
  async clearCart(@Args('id', { type: () => ID }) id: string) {
    return this.cartService.clearCart(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteCart(@Args('id', { type: () => ID }) id: string) {
    return this.cartService.delete(id);
  }

  @Query(() => CartTotalOutput)
  @UseGuards(GqlAuthGuard)
  async cartTotal(@Args('cartId', { type: () => ID }) cartId: string) {
    const total = await this.cartService.calculateCartTotal(cartId);
    return { total };
  }

  @ResolveField('user', () => User)
  async getUser(@Parent() cart: Cart) {
    return this.userService.findOne(cart.userId);
  }
}
