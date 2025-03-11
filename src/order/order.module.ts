import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { Order, OrderSchema } from './entities/order.entity';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    AddressModule
  ],
  providers: [OrderResolver, OrderService],
  exports: [OrderService]
})
export class OrderModule {}
