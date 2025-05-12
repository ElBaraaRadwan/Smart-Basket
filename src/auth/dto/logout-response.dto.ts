import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

@ObjectType()
export class LogoutResponse {
  @Field()
  @IsBoolean()
  success: boolean;

  @Field()
  @IsString()
  message: string;
}
