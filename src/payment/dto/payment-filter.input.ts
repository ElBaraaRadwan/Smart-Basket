import { Field, InputType, ID } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsString, IsDate } from 'class-validator';
import { PaymentStatus } from '../../common/enums';

@InputType()
export class PaymentFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  userId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  orderId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  method?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
