import { Field, InputType, Float, ID } from '@nestjs/graphql';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsDate,
  IsNumber,
  Min,
} from 'class-validator';
import { OrderStatus, PaymentStatus } from '../../common/enums';

@InputType()
class UpdatePaymentInfoInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  method?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  transactionId?: string;
}

@InputType()
class UpdateShippingInfoInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;
}

@InputType()
export class UpdateOrderInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @Field(() => UpdatePaymentInfoInput, { nullable: true })
  @IsOptional()
  payment?: UpdatePaymentInfoInput;

  @Field(() => UpdateShippingInfoInput, { nullable: true })
  @IsOptional()
  shipping?: UpdateShippingInfoInput;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  deliveredAt?: Date;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  addressId?: string;
}
