import { CreateAddressInput } from './create-address.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAddressInput extends PartialType(CreateAddressInput) {
  id: number;
}
