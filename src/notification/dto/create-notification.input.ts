import { Field, InputType, ID } from '@nestjs/graphql';
import { NotificationType } from './notification.output';

@InputType()
export class CreateNotificationInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field(() => ID)
  userId: string;

  @Field(() => String, { nullable: true })
  emailAddress?: string;

  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Field(() => String, { nullable: true })
  deviceToken?: string;
}
