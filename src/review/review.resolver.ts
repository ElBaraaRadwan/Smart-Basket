import { Resolver, Query, Mutation, Args, ID, Float } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput, UpdateReviewInput, ReviewFilterInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, RolesGuard, JwtAuthGuard } from '../common/guards';
import { CurrentUser, Roles } from '../common/decorators';
import { UserRole } from '../user/entities/user-entity';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Mutation(() => Review)
  @UseGuards(GqlAuthGuard)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @CurrentUser() user: any,
  ): Promise<Review> {
    return this.reviewService.create(createReviewInput, user._id);
  }

  @Query(() => [Review], { name: 'reviews' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(
    @Args('filter', { nullable: true }) filter?: ReviewFilterInput,
  ): Promise<Review[]> {
    return this.reviewService.findAll(filter);
  }

  @Query(() => Review, { name: 'review' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Review> {
    return this.reviewService.findOne(id);
  }

  @Query(() => [Review], { name: 'productReviews' })
  findByProduct(
    @Args('productId', { type: () => ID }) productId: string,
  ): Promise<Review[]> {
    return this.reviewService.findByProduct(productId);
  }

  @Query(() => [Review], { name: 'userReviews' })
  @UseGuards(GqlAuthGuard)
  findByUser(@CurrentUser() user: any): Promise<Review[]> {
    return this.reviewService.findByUser(user._id);
  }

  @Query(() => Float, { name: 'productAverageRating' })
  getAverageRating(
    @Args('productId', { type: () => ID }) productId: string,
  ): Promise<number> {
    return this.reviewService.getAverageRating(productId);
  }

  @Mutation(() => Review)
  @UseGuards(GqlAuthGuard)
  updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
    @CurrentUser() user: any,
  ): Promise<Review> {
    return this.reviewService.update(
      updateReviewInput._id,
      updateReviewInput,
      user._id,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeReview(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.reviewService.remove(id, user._id);
  }

  @Mutation(() => Review)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  adminUpdateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    return this.reviewService.update(
      updateReviewInput._id,
      updateReviewInput,
      null,
    );
  }
}
