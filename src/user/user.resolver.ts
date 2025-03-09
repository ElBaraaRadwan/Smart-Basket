import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserService } from './user.service';
import { User } from './entities/user-entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Query(() => User, { name: 'me' })
  getProfile() {
    // return user;
  }

  // admin access
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput._id, updateUserInput);
  }

  // user access
  @Mutation(() => User)
  updateMyProfile(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput._id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
