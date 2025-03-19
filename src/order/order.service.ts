import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { CreateOrderInput, UpdateOrderInput, OrderFilterInput } from './dto';
import { OrderStatus, PaymentStatus } from 'src/common/enums';
import { AddressService } from '../address/address.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private addressService: AddressService,
  ) {}

  async create(createOrderInput: CreateOrderInput): Promise<Order> {
    // Generate a unique order number (you can implement your own strategy)
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // If addressId is provided, verify it exists
    if (createOrderInput.addressId) {
      const address = await this.addressService.findOne(
        createOrderInput.addressId,
      );
      if (!address) {
        throw new NotFoundException(
          `Address with ID ${createOrderInput.addressId} not found`,
        );
      }
    }

    const newOrder = new this.orderModel({
      ...createOrderInput,
      orderNumber,
    });

    return newOrder.save();
  }

  async findAll(filter?: OrderFilterInput): Promise<Order[]> {
    const query = this.createFilterQuery(filter);
    return this.orderModel.find(query).sort({ createdAt: -1 }).exec();
  }

  private createFilterQuery(filter?: OrderFilterInput): Record<string, any> {
    if (!filter) return {};

    const filterMappings: Record<string, string> = {
      userId: 'userId',
      orderNumber: 'orderNumber',
      status: 'status',
      paymentStatus: 'payment.status',
      productId: 'items.productId',
      addressId: 'addressId',
    };

    const query = Object.entries(filterMappings).reduce(
      (acc, [key, value]) => {
        if (filter[key as keyof OrderFilterInput]) {
          acc[value] = filter[key as keyof OrderFilterInput];
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    if (filter.startDate || filter.endDate) {
      query.createdAt = {
        ...(filter.startDate && { $gte: filter.startDate }),
        ...(filter.endDate && { $lte: filter.endDate }),
      };
    }

    return query;
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderModel.findOne({ orderNumber }).exec();
    if (!order) {
      throw new NotFoundException(`Order with number ${orderNumber} not found`);
    }
    return order;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, updateOrderInput: UpdateOrderInput): Promise<Order> {
    const { id: _, ...updateData } = updateOrderInput;

    // If addressId is provided, verify it exists
    if (updateOrderInput.addressId) {
      const address = await this.addressService.findOne(
        updateOrderInput.addressId,
      );
      if (!address) {
        throw new NotFoundException(
          `Address with ID ${updateOrderInput.addressId} not found`,
        );
      }
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.findOne(id);

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel a delivered order');
    }

    // Update order status
    order.status = OrderStatus.CANCELLED;

    return order.save();
  }

  async processOrder(id: string): Promise<Order> {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Cannot process an order with status ${order.status}`,
      );
    }

    // Update order status
    order.status = OrderStatus.PROCESSING;

    return order.save();
  }

  async shipOrder(id: string, trackingNumber?: string): Promise<Order> {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.PROCESSING) {
      throw new BadRequestException(
        `Cannot ship an order with status ${order.status}`,
      );
    }

    // Update order status and tracking number if provided
    order.status = OrderStatus.SHIPPED;
    if (trackingNumber) {
      order.shipping.trackingNumber = trackingNumber;
    }

    return order.save();
  }

  async deliverOrder(id: string): Promise<Order> {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.SHIPPED) {
      throw new BadRequestException(
        `Cannot mark as delivered an order with status ${order.status}`,
      );
    }

    // Update order status and add delivery date
    order.status = OrderStatus.DELIVERED;
    order.deliveredAt = new Date();

    return order.save();
  }

  async refundOrder(id: string, reason: string): Promise<Order> {
    const order = await this.findOne(id);

    // Update payment status to refunded
    order.payment.status = PaymentStatus.REFUNDED;

    // Optionally you can store the refund reason in a field (would need to add this to the schema)

    return order.save();
  }

  async getOrderSummary(startDate?: Date, endDate?: Date) {
    const dateQuery = this.createDateQuery(startDate, endDate);

    const statusCounts = await this.getOrderCountsByStatus(dateQuery, [
      OrderStatus.PENDING,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
    ]);

    const totalOrders = await this.orderModel.countDocuments(dateQuery);
    const orders = await this.orderModel.find(dateQuery).exec();

    const totalRevenue = orders
      .filter((order) => order.status !== OrderStatus.CANCELLED)
      .reduce((sum, order) => sum + order.total, 0);

    return {
      totalOrders,
      ...statusCounts,
      totalRevenue,
    };
  }

  async updateOrderPaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
  ): Promise<Order> {
    const order = await this.findOne(orderId);

    // Update the payment status in the order
    const updateData: UpdateOrderInput = {
      id: orderId,
      payment: {
        status: paymentStatus,
      },
    };

    // If payment is marked as paid, update order status accordingly
    if (
      paymentStatus === PaymentStatus.PAID &&
      order.status === OrderStatus.PENDING
    ) {
      updateData.status = OrderStatus.PROCESSING;
    }

    // If payment is refunded or cancelled, update order status
    if (
      (paymentStatus === PaymentStatus.REFUNDED ||
        paymentStatus === PaymentStatus.CANCELLED) &&
      order.status !== OrderStatus.CANCELLED
    ) {
      updateData.status = OrderStatus.CANCELLED;
    }

    return this.update(orderId, updateData);
  }

  private createDateQuery(
    startDate?: Date,
    endDate?: Date,
  ): Record<string, any> {
    if (!startDate && !endDate) return {};

    return {
      createdAt: {
        ...(startDate && { $gte: startDate }),
        ...(endDate && { $lte: endDate }),
      },
    };
  }

  private async getOrderCountsByStatus(
    dateQuery: Record<string, any>,
    statuses: OrderStatus[],
  ) {
    const counts = await Promise.all(
      statuses.map((status) =>
        this.orderModel.countDocuments({ ...dateQuery, status }),
      ),
    );

    return statuses.reduce(
      (acc, status, index) => {
        const key = `${status.toLowerCase()}Orders`;
        acc[key] = counts[index];
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
