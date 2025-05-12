import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import {
  CreatePaymentInput,
  UpdatePaymentInput,
  PaymentFilterInput,
} from './dto';
import { GqlAuthGuard, RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';
import { UserRole } from 'src/user/entities/user-entity';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => Payment)
  @UseGuards(GqlAuthGuard)
  createPayment(
    @Args('input') createPaymentInput: CreatePaymentInput,
    @CurrentUser() user,
  ): Promise<Payment> {
    // Ensure the user can only create payments for themselves
    if (user.role !== 'ADMIN' && user.id !== createPaymentInput.userId) {
      createPaymentInput.userId = user.id;
    }

    return this.paymentService.create(createPaymentInput);
  }

  @Query(() => [Payment], { name: 'payments' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(
    @Args('filter', { nullable: true }) filter?: PaymentFilterInput,
  ): Promise<Payment[]> {
    return this.paymentService.findAll(filter);
  }

  @Query(() => Payment, { name: 'payment', nullable: true })
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user,
  ): Promise<Payment> {
    const payment = await this.paymentService.findOne(id);

    // Ensure users can only access their own payments unless they're an admin
    if (user.role !== 'ADMIN' && payment.userId !== user.id) {
      throw new Error('Not authorized to access this payment');
    }

    return payment;
  }

  @Query(() => [Payment], { name: 'paymentsByOrder' })
  @UseGuards(GqlAuthGuard)
  async findByOrder(
    @Args('orderId', { type: () => ID }) orderId: string,
    @CurrentUser() user,
  ): Promise<Payment[]> {
    const payments = await this.paymentService.findByOrder(orderId);

    // For non-admin users, filter to only show their own payments
    if (user.role !== 'ADMIN') {
      return payments.filter((payment) => payment.userId === user.id);
    }

    return payments;
  }

  @Query(() => [Payment], { name: 'paymentsByUser' })
  @UseGuards(GqlAuthGuard)
  async findByUser(
    @Args('userId', { type: () => ID }) userId: string,
    @CurrentUser() user,
  ): Promise<Payment[]> {
    // Ensure users can only access their own payments unless they're an admin
    if (user.role !== 'ADMIN' && userId !== user.id) {
      throw new Error('Not authorized to access payments for this user');
    }

    return this.paymentService.findByUser(userId);
  }

  @Mutation(() => Payment)
  @UseGuards(GqlAuthGuard)
  async updatePayment(
    @Args('input') updatePaymentInput: UpdatePaymentInput,
    @CurrentUser() user,
  ): Promise<Payment> {
    const payment = await this.paymentService.findOne(updatePaymentInput.id);

    // Ensure users can only update their own payments unless they're an admin
    if (user.role !== 'ADMIN' && payment.userId !== user.id) {
      throw new Error('Not authorized to update this payment');
    }

    return this.paymentService.update(
      updatePaymentInput.id,
      updatePaymentInput,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  removePayment(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.paymentService.remove(id);
  }

  @Mutation(() => Payment)
  @UseGuards(GqlAuthGuard)
  async processPayment(
    @Args('paymentId', { type: () => ID }) paymentId: string,
    @CurrentUser() user,
  ): Promise<Payment> {
    const payment = await this.paymentService.findOne(paymentId);

    // Ensure users can only process their own payments unless they're an admin
    if (user.role !== 'ADMIN' && payment.userId !== user.id) {
      throw new Error('Not authorized to process this payment');
    }

    return this.paymentService.processPayment(paymentId);
  }

  @Mutation(() => Payment)
  @UseGuards(GqlAuthGuard)
  async confirmPayment(
    @Args('paymentId', { type: () => ID }) paymentId: string,
    @Args('paymentMethodId') paymentMethodId: string,
    @CurrentUser() user,
  ): Promise<Payment> {
    const payment = await this.paymentService.findOne(paymentId);

    // Ensure users can only confirm their own payments unless they're an admin
    if (user.role !== 'ADMIN' && payment.userId !== user.id) {
      throw new Error('Not authorized to confirm this payment');
    }

    return this.paymentService.confirmPayment(paymentId, paymentMethodId);
  }

  @Mutation(() => Payment)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  refundPayment(
    @Args('paymentId', { type: () => ID }) paymentId: string,
    @Args('amount', { type: () => Number, nullable: true }) amount?: number,
  ): Promise<Payment> {
    return this.paymentService.refundPayment(paymentId, amount);
  }
}
