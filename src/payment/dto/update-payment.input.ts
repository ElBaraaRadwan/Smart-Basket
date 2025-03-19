import { Field, InputType, Float, ID } from '@nestjs/graphql';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsDate,
  IsNumber,
  Min,
} from 'class-validator';
import { PaymentStatus } from '../../common/enums';

@InputType()
export class UpdatePaymentInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  method?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  paidAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  failureMessage?: string;
}
