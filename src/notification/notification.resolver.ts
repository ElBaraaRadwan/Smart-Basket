import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  NotificationOutput,
  CreateNotificationInput,
  UpdateNotificationInput,
  NotificationFilterInput,
  PaginationInput,
} from './dto';
import { GqlAuthGuard, RolesGuard, JwtAuthGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';
import { UserRole, User } from 'src/user/entities/user-entity';

@Resolver(() => NotificationOutput)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => NotificationOutput)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createNotification(
    @Args('input') createNotificationInput: CreateNotificationInput,
  ): Promise<NotificationOutput> {
    return this.notificationService.create(createNotificationInput);
  }

  @Query(() => [NotificationOutput])
  @UseGuards(GqlAuthGuard)
  async notifications(
    @CurrentUser() user: User,
    @Args('filter', { nullable: true }) filter?: NotificationFilterInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<NotificationOutput[]> {
    const result = await this.notificationService.findAll(
      user._id,
      filter,
      pagination,
    );
    return result.notifications;
  }

  @Query(() => Int)
  @UseGuards(GqlAuthGuard)
  async notificationsCount(
    @CurrentUser() user: User,
    @Args('filter', { nullable: true }) filter?: NotificationFilterInput,
  ): Promise<number> {
    const result = await this.notificationService.findAll(user._id, filter);
    return result.total;
  }

  @Query(() => NotificationOutput)
  @UseGuards(GqlAuthGuard)
  async notification(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<NotificationOutput> {
    return this.notificationService.findOne(id, user._id);
  }

  @Query(() => Int)
  @UseGuards(GqlAuthGuard)
  async unreadNotificationsCount(@CurrentUser() user: User): Promise<number> {
    return this.notificationService.getUnreadCount(user._id);
  }

  @Mutation(() => NotificationOutput)
  @UseGuards(GqlAuthGuard)
  async updateNotification(
    @Args('input') updateNotificationInput: UpdateNotificationInput,
    @CurrentUser() user: User,
  ): Promise<NotificationOutput> {
    return this.notificationService.update(updateNotificationInput, user._id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteNotification(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.notificationService.remove(id, user._id);
  }

  @Mutation(() => Int)
  @UseGuards(GqlAuthGuard)
  async markAllNotificationsAsRead(@CurrentUser() user: User): Promise<number> {
    return this.notificationService.markAllAsRead(user._id);
  }

  @Mutation(() => NotificationOutput)
  @UseGuards(GqlAuthGuard)
  async markNotificationAsRead(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<NotificationOutput> {
    return this.notificationService.update({ id, markAsRead: true }, user._id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async sendBulkNotifications(
    @Args('input', { type: () => [CreateNotificationInput] })
    inputs: CreateNotificationInput[],
  ): Promise<boolean> {
    try {
      await Promise.all(
        inputs.map((input) => this.notificationService.create(input)),
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
