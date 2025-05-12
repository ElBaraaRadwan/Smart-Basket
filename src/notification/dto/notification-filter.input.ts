import { Field, InputType } from '@nestjs/graphql';
import { NotificationStatus, NotificationType } from 'src/common/enums';

@InputType()
export class NotificationFilterInput {
  @Field(() => NotificationType, { nullable: true })
  type?: NotificationType;

  @Field(() => NotificationStatus, { nullable: true })
  status?: NotificationStatus;

  @Field(() => Boolean, { nullable: true })
  onlyUnread?: boolean;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;
}
