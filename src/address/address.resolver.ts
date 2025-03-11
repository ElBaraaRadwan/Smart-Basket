import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';
import {
  CreateAddressInput,
  UpdateAddressInput,
  AddressFilterInput,
} from './dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user-entity';

@Resolver(() => Address)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Mutation(() => Address)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createAddress(
    @Args('createAddressInput') createAddressInput: CreateAddressInput,
  ): Promise<Address> {
    return this.addressService.create(createAddressInput);
  }

  @Query(() => [Address], { name: 'addresses' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async findAll(
    @Args('filter', { nullable: true }) filter?: AddressFilterInput,
  ): Promise<Address[]> {
    return this.addressService.findAll(filter);
  }

  @Query(() => Address, { name: 'address', nullable: true })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Address> {
    return this.addressService.findOne(id);
  }

  @Query(() => [Address], { name: 'addressesByUser' })
  @UseGuards(GqlAuthGuard)
  async findByUser(@Args('userId') userId: string): Promise<Address[]> {
    return this.addressService.findByUser(userId);
  }

  @Query(() => Address, { name: 'defaultAddress', nullable: true })
  @UseGuards(GqlAuthGuard)
  async findDefaultAddress(@Args('userId') userId: string): Promise<Address> {
    return this.addressService.findDefaultAddress(userId);
  }

  @Mutation(() => Address)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async updateAddress(
    @Args('updateAddressInput') updateAddressInput: UpdateAddressInput,
  ): Promise<Address> {
    return this.addressService.update(
      updateAddressInput.id,
      updateAddressInput,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeAddress(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.addressService.remove(id);
  }

  @Mutation(() => Address)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async setDefaultAddress(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Address> {
    return this.addressService.setDefault(id);
  }
}
