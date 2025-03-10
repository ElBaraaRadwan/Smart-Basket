import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { CreateCartInput } from './dto/cart-item.input';
import { UpdateCartInput } from './dto/update-cart-item.input';

@Resolver('Cart')
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation('createCart')
  create(@Args('createCartInput') createCartInput: CreateCartInput) {
    return this.cartService.create(createCartInput);
  }

  @Query('cart')
  findAll() {
    return this.cartService.findAll();
  }

  @Query('cart')
  findOne(@Args('id') id: number) {
    return this.cartService.findOne(id);
  }

  @Mutation('updateCart')
  update(@Args('updateCartInput') updateCartInput: UpdateCartInput) {
    return this.cartService.update(updateCartInput.id, updateCartInput);
  }

  @Mutation('removeCart')
  remove(@Args('id') id: number) {
    return this.cartService.remove(id);
  }
}
