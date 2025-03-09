import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from 'src/schemas';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true }) firstName?: string;
  @Field({ nullable: true }) lastName?: string;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) password?: string;
  @Field(() => [String], { nullable: true }) roles?: UserRole[];
}
