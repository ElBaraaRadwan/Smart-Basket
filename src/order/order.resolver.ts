import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';

@Resolver('Order')
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation('createOrder')
  create(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.orderService.create(createOrderInput);
  }

  @Query('order')
  findAll() {
    return this.orderService.findAll();
  }

  @Query('order')
  findOne(@Args('id') id: number) {
    return this.orderService.findOne(id);
  }

  @Mutation('updateOrder')
  update(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.orderService.update(updateOrderInput.id, updateOrderInput);
  }

  @Mutation('removeOrder')
  remove(@Args('id') id: number) {
    return this.orderService.remove(id);
  }
}
