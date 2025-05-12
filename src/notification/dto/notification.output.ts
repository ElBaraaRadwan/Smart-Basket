import { Field, ObjectType, ID } from '@nestjs/graphql';
import { NotificationStatus, NotificationType } from 'src/common/enums';

@ObjectType()
export class NotificationOutput {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field(() => NotificationStatus)
  status: NotificationStatus;

  @Field(() => ID)
  userId: string;

  @Field(() => Date, { nullable: true })
  readAt?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
