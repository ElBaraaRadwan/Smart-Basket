import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional, IsArray, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user-entity';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

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
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  favoriteCategories?: string[];
}
