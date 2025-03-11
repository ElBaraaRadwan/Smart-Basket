import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AddressService } from './address.service';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';

@Resolver('Address')
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Mutation('createAddress')
  create(@Args('createAddressInput') createAddressInput: CreateAddressInput) {
    return this.addressService.create(createAddressInput);
  }

  @Query('address')
  findAll() {
    return this.addressService.findAll();
  }

  @Query('address')
  findOne(@Args('id') id: number) {
    return this.addressService.findOne(id);
  }

  @Mutation('updateAddress')
  update(@Args('updateAddressInput') updateAddressInput: UpdateAddressInput) {
    return this.addressService.update(updateAddressInput.id, updateAddressInput);
  }

  @Mutation('removeAddress')
  remove(@Args('id') id: number) {
    return this.addressService.remove(id);
  }
}
