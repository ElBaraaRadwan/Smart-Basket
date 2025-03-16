import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryInput } from './dto/create-delivery.input';
import { UpdateDeliveryInput } from './dto/update-delivery.input';

@Resolver('Delivery')
export class DeliveryResolver {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Mutation('createDelivery')
  create(@Args('createDeliveryInput') createDeliveryInput: CreateDeliveryInput) {
    return this.deliveryService.create(createDeliveryInput);
  }

  @Query('delivery')
  findAll() {
    return this.deliveryService.findAll();
  }

  @Query('delivery')
  findOne(@Args('id') id: number) {
    return this.deliveryService.findOne(id);
  }

  @Mutation('updateDelivery')
  update(@Args('updateDeliveryInput') updateDeliveryInput: UpdateDeliveryInput) {
    return this.deliveryService.update(updateDeliveryInput.id, updateDeliveryInput);
  }

  @Mutation('removeDelivery')
  remove(@Args('id') id: number) {
    return this.deliveryService.remove(id);
  }
}
