import { Field, InputType, Float, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsOptional,
  IsUrl,
  ArrayMinSize,
  ValidateNested,
  IsEmail,
  IsMobilePhone,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class WorkingHoursInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  day: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  open: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  close: string;
}

@InputType()
class DeliveryZoneInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  areaName: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  zipCodes: string[];
}

@InputType()
export class CreateStoreInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  logoUrl: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  bannerUrl?: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  cuisineTypes: string[];

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  deliveryFee: number;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  minOrderAmount: number;

  @Field(() => Int)
  @IsNumber()
  @Min(10)
  @Max(120)
  avgPrepTime: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  @Max(50)
  commissionRate: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @Field(() => [WorkingHoursInput])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursInput)
  workingHours: WorkingHoursInput[];

  @Field(() => [DeliveryZoneInput])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DeliveryZoneInput)
  deliveryZones: DeliveryZoneInput[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @Field(() => String, { nullable: true })
  @IsMobilePhone()
  @IsOptional()
  contactPhone?: string;

  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;
}

@InputType()
export class UpdateStoreInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
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
  @IsMobilePhone()
  @IsOptional()
  contactPhone?: string;

  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;
}
