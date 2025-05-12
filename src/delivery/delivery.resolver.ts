import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { DeliveryService } from './delivery.service';
import { Delivery } from './entities/delivery.entity';
import {
  CreateDeliveryInput,
  UpdateDeliveryInput,
  DeliveryFilterInput,
} from './dto';
import { GqlAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { UserRole } from 'src/user/entities/user-entity';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Delivery)
export class DeliveryResolver {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Mutation(() => Delivery)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_MANAGER)
  async createDelivery(
    @Args('createDeliveryInput') createDeliveryInput: CreateDeliveryInput,
  ): Promise<Delivery> {
    return this.deliveryService.create(createDeliveryInput);
  }

  @Query(() => [Delivery])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DELIVERY_PERSON, UserRole.STORE_MANAGER)
  async deliveries(
    @Args('filterInput', { nullable: true }) filterInput?: DeliveryFilterInput,
  ): Promise<Delivery[]> {
    return this.deliveryService.findAll(filterInput);
  }

  @Query(() => Delivery)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DELIVERY_PERSON, UserRole.STORE_MANAGER)
  async delivery(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Delivery> {
    return this.deliveryService.findOne(id);
  }

  @Mutation(() => Delivery)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_MANAGER)
  async updateDelivery(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateDeliveryInput') updateDeliveryInput: UpdateDeliveryInput,
  ): Promise<Delivery> {
    return this.deliveryService.update(id, updateDeliveryInput);
  }

  @Mutation(() => Delivery)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DELIVERY_PERSON)
  async assignDriver(
    @Args('id', { type: () => ID }) id: string,
    @Args('driverId') driverId: string,
  ): Promise<Delivery> {
    return this.deliveryService.assignDriver(id, driverId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeDelivery(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    const result = await this.deliveryService.remove(id);
    return !!result;
  }
}
