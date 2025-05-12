import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Wishlist } from './entities/wishlist.entity';
import { GqlAuthGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';

@Resolver(() => Wishlist)
export class WishlistResolver {
constructor(private readonly wishlistService: WishlistService) {}

@Query(() => Wishlist, { nullable: true })
@UseGuards(GqlAuthGuard)
async getWishlist(@CurrentUser() user: any) {
return this.wishlistService.getWishlist(user._id);
}

@Query(() => Wishlist, { nullable: true })
@UseGuards(GqlAuthGuard)
async getWishlistById(@Args('id', { type: () => ID }) id: string) {
return this.wishlistService.getWishlistById(id);
}

@Mutation(() => Wishlist)
@UseGuards(GqlAuthGuard)
async addToWishlist(
@CurrentUser() user: any,
@Args('productId', { type: () => ID }) productId: string,
) {
return this.wishlistService.addToWishlist(user._id, productId);
}

@Mutation(() => Wishlist)
@UseGuards(GqlAuthGuard)
async removeFromWishlist(
@CurrentUser() user: any,
@Args('productId', { type: () => ID }) productId: string,
) {
return this.wishlistService.removeFromWishlist(user._id, productId);
}

@Mutation(() => Wishlist)
@UseGuards(GqlAuthGuard)
async clearWishlist(@CurrentUser() user: any) {
return this.wishlistService.clearWishlist(user._id);
}
}
