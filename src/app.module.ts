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
  ],
})
export class AppModule {}
