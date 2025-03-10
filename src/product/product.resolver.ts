import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { User, UserRole } from '../user/entities/user-entity';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductFilterInput
} from './dto';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_MANAGER)
  createProduct(
    @Args('input') createProductInput: CreateProductInput,
    @CurrentUser() user: User
  ): Promise<Product> {
    return this.productService.create(createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  findAll(
    @Args('filter', { nullable: true }) filter?: ProductFilterInput
  ): Promise<Product[]> {
    return this.productService.findAll(filter);
  }

  @Query(() => Int, { name: 'productsCount' })
  countProducts(
    @Args('filter', { nullable: true }) filter?: ProductFilterInput
  ): Promise<number> {
    return this.productService.countProducts(filter);
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Query(() => Product, { name: 'productBySku' })
  findBySku(@Args('sku') sku: string): Promise<Product> {
    return this.productService.findBySku(sku);
  }

  @Query(() => [Product], { name: 'featuredProducts' })
  findFeatured(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number
  ): Promise<Product[]> {
    return this.productService.findFeatured(limit);
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_MANAGER)
  updateProduct(
    @Args('input') updateProductInput: UpdateProductInput,
    @CurrentUser() user: User
  ): Promise<Product> {
    return this.productService.update(updateProductInput._id, updateProductInput);
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_MANAGER)
  removeProduct(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
  ): Promise<Product> {
    return this.productService.remove(id);
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_MANAGER)
  updateProductStock(
    @Args('id', { type: () => ID }) id: string,
    @Args('quantity', { type: () => Int }) quantity: number,
    @CurrentUser() user: User
  ): Promise<Product> {
    return this.productService.updateStock(id, quantity);
  }
}
