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

  async update(
    id: string,
    updateAddressInput: UpdateAddressInput,
  ): Promise<Address> {
    const { id: _, ...updateData } = updateAddressInput;

    // If setting as default, unset any other default addresses for this user
    if (updateData.isDefault) {
      const address = await this.addressModel.findById(id);
      if (address) {
        await this.addressModel.updateMany(
          { userId: address.userId, isDefault: true, _id: { $ne: id } },
          { isDefault: false },
        );
      }
    }

    const updatedAddress = await this.addressModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedAddress) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return updatedAddress;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.addressModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return true;
  }

  async setDefault(id: string): Promise<Address> {
    const address = await this.addressModel.findById(id);

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    // Unset any other default addresses for this user
    await this.addressModel.updateMany(
      { userId: address.userId, isDefault: true },
      { isDefault: false },
    );

    // Set this address as default
    address.isDefault = true;
    return address.save();
  }
}
