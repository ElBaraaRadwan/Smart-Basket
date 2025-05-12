import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { NotificationType, NotificationStatus } from 'src/common/enums'; // Adjust path based on your project structure

@ObjectType()
@Schema({ timestamps: true })
export class Notification {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  content: string;

  @Field(() => NotificationType)
  @Prop({
    type: String,
    required: true,
    enum: NotificationType,
    default: NotificationType.EMAIL,
  })
  type: NotificationType;

  @Field(() => NotificationStatus)
  @Prop({
    type: String,
    required: true,
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  userId: string;

  @Field({ nullable: true })
  @Prop()
  emailAddress?: string;

  @Field({ nullable: true })
  @Prop()
  phoneNumber?: string;

  @Field({ nullable: true })
  @Prop()
  deviceToken?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  readAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  sentAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  deliveredAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  failedAt?: Date;

  @Field({ nullable: true })
  @Prop()
  failureReason?: string;

  @Field(() => GraphQLISODateTime)
  @Prop()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @Prop()
  updatedAt: Date;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Add indexes for common query filters
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ status: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ readAt: 1 });
