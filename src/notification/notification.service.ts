import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';
import {
  CreateNotificationInput,
  NotificationOutput,
  UpdateNotificationInput,
  NotificationFilterInput,
  PaginationInput,
} from './dto';
import { NotificationStatus, NotificationType } from 'src/common/enums';
import { EmailProvider } from './providers/email.provider';
import { SmsProvider } from './providers/sms.provider';
import { PushProvider } from './providers/push.provider';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private emailProvider: EmailProvider,
    private smsProvider: SmsProvider,
    private pushProvider: PushProvider,
  ) {}

  async create(
    createNotificationInput: CreateNotificationInput,
  ): Promise<NotificationOutput> {
    try {
      const notification = new this.notificationModel({
        ...createNotificationInput,
        status: NotificationStatus.PENDING,
      });

      const savedNotification = await notification.save();

      // Process notification based on type
      await this.processNotification(savedNotification);

      return this.mapToOutput(savedNotification);
    } catch (error) {
      this.logger.error(
        `Failed to create notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(
    userId: string,
    filter?: NotificationFilterInput,
    pagination?: PaginationInput,
  ): Promise<{ notifications: NotificationOutput[]; total: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = pagination || {};

      // Build query
      const query: any = { userId };

      if (filter?.type) {
        query.type = filter.type;
      }

      if (filter?.status) {
        query.status = filter.status;
      }

      if (filter?.onlyUnread) {
        query.readAt = { $exists: false };
      }

      if (filter?.startDate || filter?.endDate) {
        query.createdAt = {};
        if (filter.startDate) {
          query.createdAt.$gte = filter.startDate;
        }
        if (filter.endDate) {
          query.createdAt.$lte = filter.endDate;
        }
      }

      // Execute query
      const skip = (page - 1) * limit;
      const sort: { [key: string]: 1 | -1 } = {
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      };

      const [notifications, total] = await Promise.all([
        this.notificationModel
          .find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.notificationModel.countDocuments(query),
      ]);

      return {
        notifications: notifications.map((notif) => this.mapToOutput(notif)),
        total,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch notifications: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string, userId: string): Promise<NotificationOutput> {
    try {
      const notification = await this.notificationModel
        .findOne({ _id: id, userId })
        .exec();

      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }

      return this.mapToOutput(notification);
    } catch (error) {
      this.logger.error(
        `Failed to fetch notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    updateNotificationInput: UpdateNotificationInput,
    userId: string,
  ): Promise<NotificationOutput> {
    try {
      const { id, status, markAsRead } = updateNotificationInput;

      const updateData: any = {};

      if (status) {
        updateData.status = status;
      }

      if (markAsRead) {
        updateData.readAt = new Date();
      }

      const notification = await this.notificationModel
        .findOneAndUpdate(
          { _id: id, userId },
          { $set: updateData },
          { new: true },
        )
        .exec();

      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }

      return this.mapToOutput(notification);
    } catch (error) {
      this.logger.error(
        `Failed to update notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<boolean> {
    try {
      const result = await this.notificationModel
        .deleteOne({ _id: id, userId })
        .exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to delete notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await this.notificationModel
        .updateMany(
          { userId, readAt: { $exists: false } },
          { $set: { readAt: new Date() } },
        )
        .exec();

      return result.modifiedCount;
    } catch (error) {
      this.logger.error(
        `Failed to mark all notifications as read: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await this.notificationModel
        .countDocuments({
          userId,
          readAt: { $exists: false },
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to get unread count: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async processNotification(
    notification: NotificationDocument,
  ): Promise<void> {
    try {
      let success = false;

      switch (notification.type) {
        case NotificationType.EMAIL:
          if (notification.emailAddress) {
            success = await this.emailProvider.sendEmail(
              notification.emailAddress,
              notification.title,
              notification.content,
            );
          } else {
            this.logger.warn(
              `Email notification ${notification._id} has no email address`,
            );
          }
          break;

        case NotificationType.SMS:
          if (notification.phoneNumber) {
            success = await this.smsProvider.sendSms(
              notification.phoneNumber,
              notification.content,
            );
          } else {
            this.logger.warn(
              `SMS notification ${notification._id} has no phone number`,
            );
          }
          break;

        case NotificationType.PUSH:
          if (notification.deviceToken) {
            success = await this.pushProvider.sendPushNotification(
              notification.deviceToken,
              notification.title,
              notification.content,
            );
          } else {
            this.logger.warn(
              `Push notification ${notification._id} has no device token`,
            );
          }
          break;

        default:
          this.logger.warn(`Unknown notification type: ${notification.type}`);
      }

      // Update notification status based on delivery result
      const updateData: Partial<Notification> = {
        sentAt: new Date(),
        status: success ? NotificationStatus.SENT : NotificationStatus.FAILED,
      };

      if (!success) {
        updateData.failedAt = new Date();
        updateData.failureReason = `Failed to send ${notification.type} notification`;
      }

      await this.notificationModel
        .updateOne({ _id: notification._id }, { $set: updateData })
        .exec();
    } catch (error) {
      this.logger.error(
        `Error processing notification ${notification._id}: ${error.message}`,
        error.stack,
      );

      // Mark as failed
      await this.notificationModel
        .updateOne(
          { _id: notification._id },
          {
            $set: {
              status: NotificationStatus.FAILED,
              failedAt: new Date(),
              failureReason: error.message,
            },
          },
        )
        .exec();
    }
  }

  private mapToOutput(notification: NotificationDocument): NotificationOutput {
    const output = {
      id: notification._id.toString(),
      title: notification.title,
      content: notification.content,
      type: notification.type,
      status: notification.status,
      userId: notification.userId.toString(),
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };

    return output;
  }
}
