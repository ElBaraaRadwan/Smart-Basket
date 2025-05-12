import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
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
import { StripeService } from './stripe/stripe.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private orderService: OrderService,
    private stripeService: StripeService,
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

    // If payment method is Stripe, create a payment intent
    if (createPaymentInput.method.toLowerCase() === 'stripe') {
      try {
        const paymentIntent = await this.stripeService.createPaymentIntent(
          createPaymentInput.amount,
          'usd', // Default to USD, you can make this configurable
          {
            orderId: createPaymentInput.orderId,
            userId: createPaymentInput.userId,
          },
        );

        // Store the payment intent ID in the payment object
        createPaymentInput.paymentIntentId = paymentIntent.id;
        this.logger.log(`Created Stripe payment intent: ${paymentIntent.id}`);
      } catch (error) {
        this.logger.error(
          `Error creating Stripe payment intent: ${error.message}`,
        );
        throw new BadRequestException(
          `Failed to create Stripe payment: ${error.message}`,
        );
      }
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

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException(`Payment is not in PENDING status`);
    }

    if (payment.method.toLowerCase() === 'stripe') {
      // Stripe payment processing
      if (!payment.paymentIntentId) {
        throw new BadRequestException('No payment intent ID found');
      }

      try {
        // Check the status of the payment intent
        const paymentIntent = await this.stripeService.getPaymentIntent(
          payment.paymentIntentId,
        );

        if (paymentIntent.status === 'succeeded') {
          // Payment was successful
          const updateData: UpdatePaymentInput = {
            id: paymentId,
            status: PaymentStatus.PAID,
            paidAt: new Date(),
            transactionId: paymentIntent.id,
            // Add receipt URL if available
            receiptUrl:
              paymentIntent.charges?.data?.[0]?.receipt_url || undefined,
          };

          return this.update(paymentId, updateData);
        } else if (
          paymentIntent.status === 'requires_payment_method' ||
          paymentIntent.status === 'requires_confirmation' ||
          paymentIntent.status === 'requires_action'
        ) {
          // Payment needs further action from the customer
          throw new BadRequestException(
            `Payment requires further action: ${paymentIntent.status}`,
          );
        } else if (paymentIntent.status === 'canceled') {
          // Payment was canceled
          const updateData: UpdatePaymentInput = {
            id: paymentId,
            status: PaymentStatus.FAILED,
            failureMessage: 'Payment was canceled',
          };

          return this.update(paymentId, updateData);
        } else {
          // Other payment status
          throw new BadRequestException(
            `Unexpected payment status: ${paymentIntent.status}`,
          );
        }
      } catch (error) {
        this.logger.error(`Error processing Stripe payment: ${error.message}`);

        const updateData: UpdatePaymentInput = {
          id: paymentId,
          status: PaymentStatus.FAILED,
          failureMessage: error.message,
        };

        return this.update(paymentId, updateData);
      }
    } else {
      // Non-Stripe payment methods (e.g., manual payments)
      // For demonstration purposes, we'll mark it as paid
      const updateData: UpdatePaymentInput = {
        id: paymentId,
        status: PaymentStatus.PAID,
        paidAt: new Date(),
        transactionId: `tx_${Date.now()}`,
      };

      return this.update(paymentId, updateData);
    }
  }

  async confirmPayment(
    paymentId: string,
    paymentMethodId: string,
  ): Promise<Payment> {
    const payment = await this.findOne(paymentId);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException(`Payment is not in PENDING status`);
    }

    if (payment.method.toLowerCase() !== 'stripe') {
      throw new BadRequestException(
        `Cannot confirm payment. Method is not Stripe: ${payment.method}`,
      );
    }

    if (!payment.paymentIntentId) {
      throw new BadRequestException('No payment intent ID found');
    }

    try {
      // Check the status of the payment intent
      const paymentIntent = await this.stripeService.getPaymentIntent(
        payment.paymentIntentId,
      );

      if (paymentIntent.status === 'succeeded') {
        // Payment was successful
        const updateData: UpdatePaymentInput = {
          id: paymentId,
          status: PaymentStatus.PAID,
          paidAt: new Date(),
          transactionId: paymentIntent.id,
          // Now TypeScript will recognize the charges property
          receiptUrl:
            paymentIntent.charges?.data?.[0]?.receipt_url || undefined,
        };

        return this.update(paymentId, updateData);
      } else if (
        paymentIntent.status === 'requires_payment_method' ||
        paymentIntent.status === 'requires_confirmation' ||
        paymentIntent.status === 'requires_action'
      ) {
        // Payment needs further action from the customer
        throw new BadRequestException(
          `Payment requires further action: ${paymentIntent.status}`,
        );
      } else if (paymentIntent.status === 'canceled') {
        // Payment was canceled
        const updateData: UpdatePaymentInput = {
          id: paymentId,
          status: PaymentStatus.FAILED,
          failureMessage: 'Payment was canceled',
        };

        return this.update(paymentId, updateData);
      } else {
        // Other payment status
        throw new BadRequestException(
          `Unexpected payment status: ${paymentIntent.status}`,
        );
      }
    } catch (error) {
      this.logger.error(`Error confirming payment: ${error.message}`);

      const updateData: UpdatePaymentInput = {
        id: paymentId,
        status: PaymentStatus.FAILED,
        failureMessage: error.message,
      };

      return this.update(paymentId, updateData);
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<Payment> {
    const payment = await this.findOne(paymentId);

    if (payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException(`Cannot refund payment that is not paid`);
    }

    const refundAmount = amount || payment.amount;

    if (refundAmount > payment.amount) {
      throw new BadRequestException(
        `Refund amount cannot exceed payment amount`,
      );
    }

    if (payment.method.toLowerCase() === 'stripe') {
      if (!payment.paymentIntentId) {
        throw new BadRequestException('No payment intent ID found');
      }

      try {
        // Process refund through Stripe
        const refund = await this.stripeService.createRefund(
          payment.paymentIntentId,
          refundAmount,
        );

        const updateData: UpdatePaymentInput = {
          id: paymentId,
          status: PaymentStatus.REFUNDED,
        };

        return this.update(paymentId, updateData);
      } catch (error) {
        this.logger.error(`Error processing refund: ${error.message}`);
        throw new BadRequestException(`Refund failed: ${error.message}`);
      }
    } else {
      // Non-Stripe payment methods
      const updateData: UpdatePaymentInput = {
        id: paymentId,
        status: PaymentStatus.REFUNDED,
      };

      return this.update(paymentId, updateData);
    }
  }

  /**
   * Handle Stripe webhook events
   * @param event The Stripe event object
   */
  async handleStripeWebhook(event: any): Promise<void> {
    this.logger.log(`Processing Stripe webhook event: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object);
        break;
      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object);
        break;
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  /**
   * Handle payment_intent.succeeded webhook event
   * @param paymentIntent The payment intent object from Stripe
   */
  private async handlePaymentIntentSucceeded(
    paymentIntent: any,
  ): Promise<void> {
    try {
      // Find the payment by payment intent ID
      const payment = await this.paymentModel
        .findOne({
          paymentIntentId: paymentIntent.id,
        })
        .exec();

      if (!payment) {
        this.logger.warn(
          `Payment not found for payment intent: ${paymentIntent.id}`,
        );
        return;
      }

      if (payment.status !== PaymentStatus.PAID) {
        const updateData: UpdatePaymentInput = {
          id: payment._id,
          status: PaymentStatus.PAID,
          paidAt: new Date(),
          transactionId: paymentIntent.id,
          receiptUrl:
            paymentIntent.charges?.data?.[0]?.receipt_url || undefined,
        };

        await this.update(payment._id, updateData);
        this.logger.log(`Updated payment ${payment._id} to PAID via webhook`);
      }
    } catch (error) {
      this.logger.error(
        `Error handling webhook payment_intent.succeeded: ${error.message}`,
      );
    }
  }

  /**
   * Handle payment_intent.payment_failed webhook event
   * @param paymentIntent The payment intent object from Stripe
   */
  private async handlePaymentIntentFailed(paymentIntent: any): Promise<void> {
    try {
      const payment = await this.paymentModel
        .findOne({
          paymentIntentId: paymentIntent.id,
        })
        .exec();

      if (!payment) {
        this.logger.warn(
          `Payment not found for payment intent: ${paymentIntent.id}`,
        );
        return;
      }

      const updateData: UpdatePaymentInput = {
        id: payment._id,
        status: PaymentStatus.FAILED,
        failureMessage:
          paymentIntent.last_payment_error?.message || 'Payment failed',
      };

      await this.update(payment._id, updateData);
      this.logger.log(`Updated payment ${payment._id} to FAILED via webhook`);
    } catch (error) {
      this.logger.error(
        `Error handling webhook payment_intent.payment_failed: ${error.message}`,
      );
    }
  }

  /**
   * Handle charge.refunded webhook event
   * @param charge The charge object from Stripe
   */
  private async handleChargeRefunded(charge: any): Promise<void> {
    try {
      const payment = await this.paymentModel
        .findOne({
          paymentIntentId: charge.payment_intent,
        })
        .exec();

      if (!payment) {
        this.logger.warn(
          `Payment not found for payment intent: ${charge.payment_intent}`,
        );
        return;
      }

      const updateData: UpdatePaymentInput = {
        id: payment._id,
        status: PaymentStatus.REFUNDED,
      };

      await this.update(payment._id, updateData);
      this.logger.log(`Updated payment ${payment._id} to REFUNDED via webhook`);
    } catch (error) {
      this.logger.error(
        `Error handling webhook charge.refunded: ${error.message}`,
      );
    }
  }
}
