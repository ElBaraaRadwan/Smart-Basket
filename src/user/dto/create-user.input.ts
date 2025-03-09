import { InputType, Field, ID } from '@nestjs/graphql';
import { UserRole } from 'src/schemas';

@InputType()
export class CreateUserInput {
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() email: string;
  @Field() password: string;
  @Field(() => [String], { defaultValue: [UserRole.USER] }) roles: UserRole[];
}
