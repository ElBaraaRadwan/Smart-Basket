import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { AddressModule } from './address/address.module';
import { ReviewModule } from './review/review.module';
import { StoreModule } from './store/store.module';
import { SearchModule } from './search/search.module';
import { NotificationModule } from './notification/notification.module';
import { PaymentModule } from './payment/payment.module';
import { DeliveryModule } from './delivery/delivery.module';
import { FileModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req }),
    }),

    UserModule,
    AuthModule,
    ProductModule,
    CartModule,
    WishlistModule,
    CategoryModule,
    OrderModule,
    AddressModule,
    ReviewModule,
    StoreModule,
    SearchModule,
    NotificationModule,
    PaymentModule,
    DeliveryModule,
    FileModule,
  ],
})
export class AppModule {}
