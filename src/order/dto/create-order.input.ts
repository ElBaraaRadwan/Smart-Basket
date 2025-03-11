import { Field, InputType, Float, Int, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentStatus } from '../../common/enums';

@InputType()
class OrderItemInput {
  @Field(() => ID)
  @IsNotEmpty()
  productId: string;

  @Field()
  @IsNotEmpty()
  productName: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  variantName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  variantId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

@InputType()
class PaymentInfoInput {
  @Field()
  @IsNotEmpty()
  method: string;

  @Field()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  transactionId?: string;
}

@InputType()
class ShippingInfoInput {
  @Field()
  @IsNotEmpty()
  address: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  cost: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => ID)
  @IsNotEmpty()
  userId: string;

  @Field(() => [OrderItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  subtotal: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  tax: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  total: number;

  @Field({ defaultValue: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @Field(() => PaymentInfoInput)
  @ValidateNested()
  @Type(() => PaymentInfoInput)
  payment: PaymentInfoInput;

  @Field(() => ShippingInfoInput)
  @ValidateNested()
  @Type(() => ShippingInfoInput)
  shipping: ShippingInfoInput;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  addressId?: string;
}
