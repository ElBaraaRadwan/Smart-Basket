import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
import { CreateStoreInput, UpdateStoreInput, StoreFilterInput } from './dto';
import { GqlAuthGuard, RolesGuard } from '../common/guards';
import { CurrentUser, Roles } from '../common/decorators';
import { UserRole } from '../user/entities/user-entity';

@Resolver(() => Store)
export class StoreResolver {
  constructor(private readonly storeService: StoreService) {}

  @Mutation(() => Store)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.STORE_MANAGER, UserRole.ADMIN)
  createStore(
    @Args('createStoreInput') createStoreInput: CreateStoreInput,
    @CurrentUser() user: any,
  ): Promise<Store> {
    return this.storeService.create(createStoreInput, user._id);
  }

  @Query(() => [Store], { name: 'stores' })
  findAll(
    @Args('filter', { nullable: true }) filter?: StoreFilterInput,
  ): Promise<Store[]> {
    return this.storeService.findAll(filter);
  }

  @Query(() => Store, { name: 'store' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Store> {
    return this.storeService.findOne(id);
  }

  @Query(() => [Store], { name: 'myStores' })
  @UseGuards(GqlAuthGuard)
  findMyStores(@CurrentUser() user: any): Promise<Store[]> {
    return this.storeService.findByManager(user._id);
  }

  @Mutation(() => Store)
  @UseGuards(GqlAuthGuard)
  updateStore(
    @Args('updateStoreInput') updateStoreInput: UpdateStoreInput,
    @CurrentUser() user: any,
  ): Promise<Store> {
    return this.storeService.update(
      updateStoreInput._id,
      updateStoreInput,
      user._id,
      user.role,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeStore(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.storeService.remove(id, user._id, user.role);
  }

  @Mutation(() => Store)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleStoreFeatured(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Store> {
    return this.storeService.toggleFeatured(id);
  }

  @Mutation(() => Store)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_MANAGER)
  toggleStoreActive(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ): Promise<Store> {
    return this.storeService.toggleActive(id);
  }
}
