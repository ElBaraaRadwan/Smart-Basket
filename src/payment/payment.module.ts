import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { OrderModule } from '../order/order.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    OrderModule,
    StripeModule,
  ],
  providers: [PaymentResolver, PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
