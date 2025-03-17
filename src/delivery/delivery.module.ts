import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryService } from './delivery.service';
import { DeliveryResolver } from './delivery.resolver';
import { Delivery, DeliverySchema } from './entities/delivery.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Delivery.name, schema: DeliverySchema },
    ]),
  ],
  providers: [DeliveryService, DeliveryResolver],
  exports: [DeliveryService],
})
export class DeliveryModule {}
