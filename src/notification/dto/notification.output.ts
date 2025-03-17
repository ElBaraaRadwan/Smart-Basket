import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
  description: 'The type of notification',
});

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

registerEnumType(NotificationStatus, {
  name: 'NotificationStatus',
  description: 'The status of notification',
});

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
