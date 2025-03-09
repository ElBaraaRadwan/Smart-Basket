import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { UserRole } from '../entities/user-entity';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsMongoId()
  _id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsEnum(UserRole, { each: true })
  @IsOptional()
  roles?: UserRole[];

  @Field({ nullable: true })
  @IsOptional()
  isEmailVerified?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  favoriteCategories?: string[];
}
