import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
} from 'class-validator';

@InputType()
export class CreateAddressInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  street: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  city: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  state: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  apartment?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isDefault: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  label?: string;

  @Field(() => [Number], { defaultValue: [0, 0] })
  @IsOptional()
  @IsArray()
  coordinates: number[];
}
