import { Field, InputType, ID, Float, Int } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WorkingHoursInput } from 'src/common/shared/dto/working-hours.input';
import { DeliveryZoneInput } from 'src/common/shared/dto/delivery-zone.input';

@InputType()
export class UpdateStoreInput {
  @Field(() => ID)
  @IsMongoId()
  @IsOptional()
  _id?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cuisineTypes?: string[];

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  deliveryFee?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderAmount?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @Min(10)
  @Max(120)
  @IsOptional()
  avgPrepTime?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  @Max(50)
  @IsOptional()
  commissionRate?: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => [WorkingHoursInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursInput)
  @IsOptional()
  workingHours?: WorkingHoursInput[];

  @Field(() => [DeliveryZoneInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryZoneInput)
  @IsOptional()
  deliveryZones?: DeliveryZoneInput[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  contactEmail?: string;
}
