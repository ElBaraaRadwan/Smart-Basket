import { Field, InputType, ID } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { DeliveryStatusEnum } from 'src/common/enums';
import { Type } from 'class-transformer';

@InputType()
export class DeliveryFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  orderId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  driverId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  storeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(DeliveryStatusEnum)
  status?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isCancelled?: boolean;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateFrom?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTo?: Date;
}
