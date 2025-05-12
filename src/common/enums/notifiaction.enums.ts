import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

registerEnumType(NotificationStatus, {
  name: 'NotificationStatus',
  description: 'The different statuses a notification can have',
});

registerEnumType(NotificationType, {
  name: 'NotificationType',
  description: 'The different types of notifications',
});
