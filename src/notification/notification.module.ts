// notification.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity';
import { EmailProvider } from './providers/email.provider';
import { SmsProvider } from './providers/sms.provider';
import { PushProvider } from './providers/push.provider';
import { UserModule } from '../user/user.module'; // Adjust path as needed
import { AuthModule } from '../auth/auth.module'; // Adjust path as needed

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  providers: [
    NotificationService,
    NotificationResolver,
    EmailProvider,
    SmsProvider,
    PushProvider,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
