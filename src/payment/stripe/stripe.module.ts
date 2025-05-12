import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: StripeService,
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('STRIPE_SECRET_KEY');
        if (!apiKey) {
          throw new Error('STRIPE_SECRET_KEY environment variable is not set');
        }
        return new StripeService(apiKey);
      },
      inject: [ConfigService],
    },
  ],
  exports: [StripeService],
})
export class StripeModule {}
