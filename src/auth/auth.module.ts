import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { LocalStrategy } from '../common/strategies/local.strategy';
import { GoogleStrategy } from '../common/strategies/google.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '15m',
        },
      }),
    }),
    ConfigModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
