import { Field, InputType, ID } from '@nestjs/graphql';
import { NotificationStatus } from './notification.output';

@InputType()
export class UpdateNotificationInput {
  @Field(() => ID)
  id: string;

  @Field(() => NotificationStatus, { nullable: true })
  status?: NotificationStatus;

  @Field(() => Boolean, { nullable: true })
  markAsRead?: boolean;
}
