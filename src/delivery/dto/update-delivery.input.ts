import { Field, InputType, ID, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryLocationInput } from './create-delivery.input';
import { DeliveryStatusEnum } from 'src/common/enums';

@InputType()
export class DeliveryStatusInput {
  @Field()
  @IsNotEmpty()
  @IsEnum(DeliveryStatusEnum)
  status: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  note?: string;
}

@InputType()
export class UpdateDeliveryInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  driverId?: string;

  @Field(() => DeliveryStatusInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeliveryStatusInput)
  status?: DeliveryStatusInput;

  @Field(() => DeliveryLocationInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeliveryLocationInput)
  currentLocation?: DeliveryLocationInput;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  actualDeliveryTime?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isCancelled?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cancellationReason?: string;
}
