import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from './entities/address.entity';
import {
  CreateAddressInput,
  UpdateAddressInput,
  AddressFilterInput,
} from './dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
  ) {}

  async create(createAddressInput: CreateAddressInput): Promise<Address> {
    const newAddress = new this.addressModel(createAddressInput);

    // If this is set as default, unset any other default addresses for this user
    if (createAddressInput.isDefault) {
      await this.addressModel.updateMany(
        { userId: createAddressInput.userId, isDefault: true },
        { isDefault: false },
      );
    }

    return newAddress.save();
  }

  async findAll(filter?: AddressFilterInput): Promise<Address[]> {
    const query = filter ? { ...filter } : {};
    return this.addressModel.find(query).exec();
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressModel.findById(id).exec();
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async findByUser(userId: string): Promise<Address[]> {
    return this.addressModel.find({ userId }).exec();
  }

  async findDefaultAddress(userId: string): Promise<Address> {
    return this.addressModel.findOne({ userId, isDefault: true }).exec();
  }

  async findOneForUser(id: string, userId: string): Promise<Address> {
    const address = await this.addressModel.findOne({ _id: id, userId }).exec();
    if (!address) {
      throw new NotFoundException(
        `Address with ID ${id} not found for this user.`,
      );
    }
    return address;
  }

  async update(
    id: string,
    updateInput: UpdateAddressInput,
    userId: string,
  ): Promise<Address> {
    const address = await this.addressModel.findOne({ _id: id, userId }).exec();
    if (!address) {
      throw new NotFoundException(`Address not found or access denied`);
    }

    if (updateInput.isDefault) {
      await this.addressModel.updateMany(
        { userId, isDefault: true, _id: { $ne: id } },
        { isDefault: false },
      );
    }

    Object.assign(address, updateInput);
    return address.save();
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const result = await this.addressModel
      .deleteOne({ _id: id, userId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Address not found or access denied`);
    }
    return true;
  }

  async setDefault(id: string, userId: string): Promise<Address> {
    const address = await this.addressModel.findOne({ _id: id, userId }).exec();
    if (!address) {
      throw new NotFoundException(`Address not found or access denied`);
    }

    await this.addressModel.updateMany(
      { userId, isDefault: true, _id: { $ne: id } },
      { isDefault: false },
    );

    address.isDefault = true;
    return address.save();
  }
}
