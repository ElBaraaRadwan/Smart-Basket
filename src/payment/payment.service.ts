import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './entities/payment.entity';
import {
  CreatePaymentInput,
  UpdatePaymentInput,
  PaymentFilterInput,
} from './dto';
import { PaymentStatus } from '../common/enums';
import { OrderService } from '../order/order.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private orderService: OrderService,
  ) {}

  async create(createPaymentInput: CreatePaymentInput): Promise<Payment> {
    // Verify order exists
    const order = await this.orderService.findOne(createPaymentInput.orderId);
    if (!order) {
      throw new NotFoundException(
        `Order with ID ${createPaymentInput.orderId} not found`,
      );
    }

    // Validate payment amount matches order total
    if (createPaymentInput.amount !== order.total) {
      throw new BadRequestException(
        `Payment amount ${createPaymentInput.amount} does not match order total ${order.total}`,
      );
    }

    const newPayment = new this.paymentModel(createPaymentInput);
    return newPayment.save();
  }

  async findAll(filter?: PaymentFilterInput): Promise<Payment[]> {
    const query: any = {};

    if (filter) {
      if (filter.userId) query.userId = filter.userId;
      if (filter.orderId) query.orderId = filter.orderId;
      if (filter.method) query.method = filter.method;
      if (filter.status) query.status = filter.status;
      if (filter.transactionId) query.transactionId = filter.transactionId;

      if (filter.startDate || filter.endDate) {
        query.createdAt = {};
        if (filter.startDate) query.createdAt.$gte = filter.startDate;
        if (filter.endDate) query.createdAt.$lte = filter.endDate;
      }
    }

    return this.paymentModel.find(query).exec();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findByOrder(orderId: string): Promise<Payment[]> {
    return this.paymentModel.find({ orderId }).exec();
  }

  async findByUser(userId: string): Promise<Payment[]> {
    return this.paymentModel.find({ userId }).exec();
  }

  async update(
    id: string,
    updatePaymentInput: UpdatePaymentInput,
  ): Promise<Payment> {
    const existingPayment = await this.paymentModel.findById(id).exec();
    if (!existingPayment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // If updating status to PAID, set paidAt date
    if (
      updatePaymentInput.status === PaymentStatus.PAID &&
      existingPayment.status !== PaymentStatus.PAID
    ) {
      updatePaymentInput.paidAt = new Date();

      // Update order payment status when payment is marked as paid
      await this.orderService.updateOrderPaymentStatus(
        existingPayment.orderId,
        PaymentStatus.PAID,
      );
    }

    // If updating status to REFUNDED, update order payment status as well
    if (
      updatePaymentInput.status === PaymentStatus.REFUNDED &&
      existingPayment.status !== PaymentStatus.REFUNDED
    ) {
      await this.orderService.updateOrderPaymentStatus(
        existingPayment.orderId,
        PaymentStatus.REFUNDED,
      );
    }

    return this.paymentModel
      .findByIdAndUpdate(id, { $set: updatePaymentInput }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.paymentModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }

  async processPayment(paymentId: string): Promise<Payment> {
    const payment = await this.findOne(paymentId);

    // In a real app, you would integrate with a payment processor here
    // For this example, we'll simulate a successful payment

    const updateData: UpdatePaymentInput = {
      id: paymentId,
      status: PaymentStatus.PAID,
      paidAt: new Date(),
      transactionId: `tx_${Date.now()}`,
    };

    return this.update(paymentId, updateData);
  }

  async refundPayment(paymentId: string, amount?: number): Promise<Payment> {
    const payment = await this.findOne(paymentId);

    if (payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException(`Cannot refund payment that is not paid`);
    }

    // In a real app, you would call your payment processor's refund API
    // For this example, we'll simulate a successful refund

    const refundAmount = amount || payment.amount;

    if (refundAmount > payment.amount) {
      throw new BadRequestException(
        `Refund amount cannot exceed payment amount`,
      );
    }

    // If partial refund, you would have more complex logic here
    // For simplicity, we're setting status to REFUNDED regardless of partial/full

    const updateData: UpdatePaymentInput = {
      id: paymentId,
      status: PaymentStatus.REFUNDED,
    };

    return this.update(paymentId, updateData);
  }
}
