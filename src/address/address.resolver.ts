import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';
import {
  CreateAddressInput,
  UpdateAddressInput,
  AddressFilterInput,
} from './dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards';
import { CurrentUser } from 'src/common/decorators';
import { User } from '../user/entities/user-entity';

@Resolver(() => Address)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Mutation(() => Address)
  @UseGuards(GqlAuthGuard)
  async createAddress(
    @Args('createAddressInput') createAddressInput: CreateAddressInput,
    @CurrentUser() user: User,
  ): Promise<Address> {
    return this.addressService.create({
      ...createAddressInput,
      userId: user._id,
    });
  }

  @Query(() => [Address], { name: 'addresses' })
  @UseGuards(GqlAuthGuard)
  async findAll(
    @Args('filter', { nullable: true }) filter: AddressFilterInput,
    @CurrentUser() user: User,
  ): Promise<Address[]> {
    return this.addressService.findAll({ ...filter, userId: user._id });
  }

  @Query(() => Address, { name: 'address', nullable: true })
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Address> {
    return this.addressService.findOneForUser(id, user._id);
  }

  @Query(() => [Address], { name: 'addressesByUser' })
  @UseGuards(GqlAuthGuard)
  async findByUser(@CurrentUser() user: User): Promise<Address[]> {
    return this.addressService.findByUser(user._id);
  }

  @Query(() => Address, { name: 'defaultAddress', nullable: true })
  @UseGuards(GqlAuthGuard)
  async findDefaultAddress(@CurrentUser() user: User): Promise<Address> {
    return this.addressService.findDefaultAddress(user._id);
  }

  @Mutation(() => Address)
  @UseGuards(GqlAuthGuard)
  async updateAddress(
    @Args('updateAddressInput') updateAddressInput: UpdateAddressInput,
    @CurrentUser() user: User,
  ): Promise<Address> {
    return this.addressService.update(
      updateAddressInput.id,
      updateAddressInput,
      user._id,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeAddress(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.addressService.remove(id, user._id);
  }

  @Mutation(() => Address)
  @UseGuards(GqlAuthGuard)
  async setDefaultAddress(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Address> {
    return this.addressService.setDefault(id, user._id);
  }
}
