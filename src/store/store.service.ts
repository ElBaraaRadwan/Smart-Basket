import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './entities/store.entity';
import { CreateStoreInput, UpdateStoreInput, StoreFilterInput } from './dto';
import { UserRole } from '../user/entities/user-entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
  ) {}

  async create(
    createStoreInput: CreateStoreInput,
    userId: string,
  ): Promise<Store> {
    const newStore = new this.storeModel({
      ...createStoreInput,
      managerId: userId,
      averageRating: 0,
      totalReviews: 0,
    });
    return await newStore.save();
  }

  async findAll(filterInput?: StoreFilterInput): Promise<Store[]> {
    const filter: any = {};

    if (!filterInput) {
      return this.storeModel.find({ isActive: true }).exec();
    }

    if (filterInput.isActive !== undefined) {
      filter.isActive = filterInput.isActive;
    } else {
      filter.isActive = true;
    }

    if (filterInput.isFeatured !== undefined) {
      filter.isFeatured = filterInput.isFeatured;
    }

    if (filterInput.cuisineTypes && filterInput.cuisineTypes.length > 0) {
      filter.cuisineTypes = { $in: filterInput.cuisineTypes };
    }

    if (filterInput.minRating) {
      filter.averageRating = { $gte: filterInput.minRating };
    }

    if (filterInput.maxDeliveryTime) {
      filter.avgPrepTime = { $lte: filterInput.maxDeliveryTime };
    }

    if (filterInput.maxDeliveryFee) {
      filter.deliveryFee = { $lte: filterInput.maxDeliveryFee };
    }

    if (filterInput.tags && filterInput.tags.length > 0) {
      filter.tags = { $in: filterInput.tags };
    }

    if (filterInput.managerId) {
      filter.managerId = filterInput.managerId;
    }

    if (filterInput.zipCode) {
      filter['deliveryZones.zipCodes'] = filterInput.zipCode;
    }

    if (filterInput.searchTerm) {
      filter.$or = [
        { name: { $regex: filterInput.searchTerm, $options: 'i' } },
        { description: { $regex: filterInput.searchTerm, $options: 'i' } },
        {
          'deliveryZones.areaName': {
            $regex: filterInput.searchTerm,
            $options: 'i',
          },
        },
        { tags: { $regex: filterInput.searchTerm, $options: 'i' } },
      ];
    }

    return this.storeModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  async update(
    id: string,
    updateStoreInput: UpdateStoreInput,
    userId: string,
    userRole: string,
  ): Promise<Store> {
    const store = await this.storeModel.findById(id).exec();

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    if (store.managerId.toString() !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to update this store',
      );
    }

    return this.storeModel
      .findByIdAndUpdate(id, { $set: updateStoreInput }, { new: true })
      .exec();
  }

  async findByManager(managerId: string): Promise<Store[]> {
    return this.storeModel.find({ managerId }).exec();
  }

  async remove(id: string, userId: string, userRole: string): Promise<boolean> {
    const store = await this.storeModel.findById(id).exec();

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    if (store.managerId.toString() !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to delete this store',
      );
    }

    const result = await this.storeModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }

  async toggleFeatured(id: string): Promise<Store> {
    const store = await this.storeModel.findById(id).exec();

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return this.storeModel
      .findByIdAndUpdate(
        id,
        { $set: { isFeatured: !store.isFeatured } },
        { new: true },
      )
      .exec();
  }

  async toggleActive(id: string): Promise<Store> {
    const store = await this.storeModel.findById(id).exec();

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return this.storeModel
      .findByIdAndUpdate(
        id,
        { $set: { isActive: !store.isActive } },
        { new: true },
      )
      .exec();
  }
}
