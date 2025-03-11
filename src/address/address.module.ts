import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressService } from './address.service';
import { AddressResolver } from './address.resolver';
import { Address, AddressSchema } from './entities/address.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
  ],
  providers: [AddressResolver, AddressService],
  exports: [AddressService],
})
export class AddressModule {}
