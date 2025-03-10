// src/category/category.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput, UpdateCategoryInput } from './dto';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from 'src/user/entities/user-entity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category])
  async categories(
    @Args('parentId', { type: () => ID, nullable: true }) parentId?: string,
  ) {
    return this.categoryService.findAll(parentId);
  }

  @Query(() => [Category])
  async categoryTree() {
    return this.categoryService.getCategoryTree();
  }

  @Query(() => Category)
  async category(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => Category)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_MANAGER)
  async createCategory(
    @Args('input') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoryService.create(createCategoryInput);
  }

  @Mutation(() => Category)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_MANAGER)
  async updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.update(id, updateCategoryInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_MANAGER)
  async deleteCategory(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.remove(id);
  }
}
