import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput, UpdateOrderInput, OrderFilterInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user-entity';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ): Promise<Order> {
    return this.orderService.create(createOrderInput);
  }

  @Query(() => [Order], { name: 'orders' })
  @UseGuards(GqlAuthGuard)
  async findAll(
    @Args('filter', { nullable: true }) filter?: OrderFilterInput,
  ): Promise<Order[]> {
    return this.orderService.findAll(filter);
  }

  @Query(() => Order, { name: 'order', nullable: true })
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateOrder(
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
  ): Promise<Order> {
    return this.orderService.update(updateOrderInput.id, updateOrderInput);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async cancelOrder(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Order> {
    return this.orderService.cancelOrder(id);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async processOrder(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Order> {
    return this.orderService.processOrder(id);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async shipOrder(
    @Args('id', { type: () => ID }) id: string,
    @Args('trackingNumber', { nullable: true }) trackingNumber?: string,
  ): Promise<Order> {
    return this.orderService.shipOrder(id, trackingNumber);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deliverOrder(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Order> {
    return this.orderService.deliverOrder(id);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async refundOrder(
    @Args('id', { type: () => ID }) id: string,
    @Args('reason') reason: string,
  ): Promise<Order> {
    return this.orderService.refundOrder(id, reason);
  }
}
