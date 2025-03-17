import { registerEnumType } from '@nestjs/graphql';

export enum DeliveryStatusEnum {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  NEAR_DESTINATION = 'near_destination',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  FAILED = 'failed',
}

registerEnumType(DeliveryStatusEnum, {
  name: 'DeliveryStatusEnum',
  description: 'The different statuses a delivery can have',
});
