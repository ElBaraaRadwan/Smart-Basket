import { Field, InputType, Float, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { PaymentStatus } from '../../common/enums';

@InputType()
export class CreatePaymentInput {
  @Field(() => ID)
  @IsNotEmpty()
  orderId: string;

  @Field(() => ID)
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  method: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  amount: number;

  @Field()
  @IsEnum(PaymentStatus)
  @IsOptional()
  status: PaymentStatus = PaymentStatus.PENDING;

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
}
