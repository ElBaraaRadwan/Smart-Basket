import { CreateDeliveryInput } from './create-delivery.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateDeliveryInput extends PartialType(CreateDeliveryInput) {
  id: number;
}
