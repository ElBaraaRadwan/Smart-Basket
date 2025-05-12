import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

@InputType()
export class UpdateAddressInput {
  @Field()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  street?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  state?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  apartment?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  label?: string;
}
