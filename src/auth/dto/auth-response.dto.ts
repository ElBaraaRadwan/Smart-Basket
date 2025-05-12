import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/entities/user-entity';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string; // Changed from accessToken to token to match GraphQL schema

  @Field(() => User)
  user: User;

  @Field({ nullable: true })
  refreshToken?: string; // Optional field for refresh token
}
