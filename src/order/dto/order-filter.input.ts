import { Field, InputType, ID } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsString, IsDate } from 'class-validator';
import { OrderStatus, PaymentStatus } from '../../common/enums';

@InputType()
export class OrderFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  userId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  productId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  addressId?: string;
}
