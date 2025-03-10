import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsMongoId, IsOptional, IsString, IsUrl, Min } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @Field(() => ID, { nullable: true })
  @IsMongoId()
  @IsOptional()
  parentId?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
