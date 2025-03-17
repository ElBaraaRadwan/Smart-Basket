import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery, DeliveryDocument } from './entities/delivery.entity';
import {
  CreateDeliveryInput,
  UpdateDeliveryInput,
  DeliveryFilterInput,
} from './dto';
import { DeliveryStatusEnum } from 'src/common/enums';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>,
  ) {}

  async create(createDeliveryInput: CreateDeliveryInput): Promise<Delivery> {
    const initialStatus = {
      status: DeliveryStatusEnum.PENDING,
      timestamp: new Date(),
      note: 'Delivery created',
    };

    const newDelivery = new this.deliveryModel({
      ...createDeliveryInput,
      statusHistory: [initialStatus],
      status: DeliveryStatusEnum.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Calculate distance between pickup and dropoff locations
    newDelivery.distance = this.calculateDistance(
      createDeliveryInput.pickupLocation.latitude,
      createDeliveryInput.pickupLocation.longitude,
      createDeliveryInput.dropoffLocation.latitude,
      createDeliveryInput.dropoffLocation.longitude,
    );

    return await newDelivery.save();
  }

  async findAll(filterInput?: DeliveryFilterInput): Promise<Delivery[]> {
    const filter: any = {};

    if (filterInput) {
      if (filterInput.orderId) filter.orderId = filterInput.orderId;
      if (filterInput.driverId) filter.driverId = filterInput.driverId;
      if (filterInput.storeId) filter.storeId = filterInput.storeId;
      if (filterInput.status) filter.status = filterInput.status;
      if (filterInput.isCompleted !== undefined)
        filter.isCompleted = filterInput.isCompleted;
      if (filterInput.isCancelled !== undefined)
        filter.isCancelled = filterInput.isCancelled;

      if (filterInput.dateFrom || filterInput.dateTo) {
        filter.createdAt = {};
        if (filterInput.dateFrom)
          filter.createdAt.$gte = new Date(filterInput.dateFrom);
        if (filterInput.dateTo)
          filter.createdAt.$lte = new Date(filterInput.dateTo);
      }
    }

    return await this.deliveryModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(id).exec();
    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }
    return delivery;
  }

  async assignDriver(id: string, driverId: string): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(id).exec();
    if (!delivery)
      throw new NotFoundException(`Delivery with ID ${id} not found`);

    if (delivery.status === DeliveryStatusEnum.ASSIGNED) {
      throw new Error(`Delivery with ID ${id} is already assigned.`);
    }

    const statusUpdate = {
      status: DeliveryStatusEnum.ASSIGNED,
      timestamp: new Date(),
      note: `Driver assigned with ID: ${driverId}`,
    };

    return await this.deliveryModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            driverId,
            status: DeliveryStatusEnum.ASSIGNED,
            updatedAt: new Date(),
          },
          $push: { statusHistory: statusUpdate },
        },
        { new: true },
      )
      .exec();
  }

  async update(
    id: string,
    updateDeliveryInput: UpdateDeliveryInput,
  ): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(id).exec();
    if (!delivery)
      throw new NotFoundException(`Delivery with ID ${id} not found`);

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (updateDeliveryInput.driverId)
      updateData.driverId = updateDeliveryInput.driverId;
    if (updateDeliveryInput.currentLocation)
      updateData.currentLocation = updateDeliveryInput.currentLocation;
    if (updateDeliveryInput.actualDeliveryTime !== undefined)
      updateData.actualDeliveryTime = updateDeliveryInput.actualDeliveryTime;
    if (updateDeliveryInput.isCompleted !== undefined) {
      updateData.isCompleted = updateDeliveryInput.isCompleted;
      if (
        updateDeliveryInput.isCompleted &&
        delivery.status !== DeliveryStatusEnum.DELIVERED
      ) {
        updateData.status = DeliveryStatusEnum.DELIVERED;
        updateData.$push = {
          statusHistory: {
            status: DeliveryStatusEnum.DELIVERED,
            timestamp: new Date(),
            note: 'Delivery completed',
          },
        };
      }
    }

    if (updateDeliveryInput.isCancelled) {
      updateData.isCancelled = true;
      updateData.status = DeliveryStatusEnum.CANCELLED;
      updateData.$push = {
        statusHistory: {
          status: DeliveryStatusEnum.CANCELLED,
          timestamp: new Date(),
          note: updateDeliveryInput.cancellationReason || 'Delivery cancelled',
        },
      };
    }

    const { $push, ...setData } = updateData;
    const updateOperation: any = { $set: setData };
    if ($push) updateOperation.$push = $push;

    await this.deliveryModel.updateOne({ _id: id }, updateOperation).exec();
    return await this.deliveryModel.findById(id).exec();
  }

  async remove(id: string): Promise<Delivery> {
    const delivery = await this.deliveryModel.findByIdAndDelete(id).exec();
    if (!delivery)
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    return delivery;
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    if (lat1 === lat2 && lon1 === lon2) return 0; // Edge case for identical coordinates
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
