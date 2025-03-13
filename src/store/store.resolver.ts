import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StoreService } from './store.service';
import { CreateStoreInput } from './dto/create-store.input';
import { UpdateStoreInput } from './dto/update-store.input';

@Resolver('Store')
export class StoreResolver {
  constructor(private readonly storeService: StoreService) {}

  @Mutation('createStore')
  create(@Args('createStoreInput') createStoreInput: CreateStoreInput) {
    return this.storeService.create(createStoreInput);
  }

  @Query('store')
  findAll() {
    return this.storeService.findAll();
  }

  @Query('store')
  findOne(@Args('id') id: number) {
    return this.storeService.findOne(id);
  }

  @Mutation('updateStore')
  update(@Args('updateStoreInput') updateStoreInput: UpdateStoreInput) {
    return this.storeService.update(updateStoreInput.id, updateStoreInput);
  }

  @Mutation('removeStore')
  remove(@Args('id') id: number) {
    return this.storeService.remove(id);
  }
}
