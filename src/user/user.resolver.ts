import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';
import { UserService } from './user.service';
import { User, UserRole } from './entities/user-entity';
import { CreateUserInput, UpdateUserInput } from './dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'getAllUsers' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'getUserById' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_MANAGER)
  getUserById(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Query(() => User, { name: 'me' })
  @UseGuards(GqlAuthGuard)
  getProfile(@CurrentUser() user: User): User {
    return user;
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(updateUserInput._id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateMyProfile(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    // Allow users to update only their own profile
    return this.userService.update(user._id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  removeUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
