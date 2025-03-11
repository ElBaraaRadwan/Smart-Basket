import { CreateReviewInput } from './create-review.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateReviewInput extends PartialType(CreateReviewInput) {
  id: number;
}
