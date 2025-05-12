import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user-entity';
import { JwtPayload } from './interface/jwt-payload.interface';
import {
  SignupInput,
  AuthResponse,
  LoginInput,
  RefreshTokenInput,
} from './dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async signup(
    signupInput: SignupInput,
    res?: Response,
  ): Promise<AuthResponse> {
    // Create user
    const user = await this.userService.create({
      ...signupInput,
    });

    // Generate accessTokens
    const { accessToken, refreshToken } = this.generateTokens(user);

    // Set tokens in cookies if response object is provided
    if (res) {
      this.setTokenCookies(res, accessToken, refreshToken);
    }

    this.logger.log(
      `User ${user.email} signed up successfully, with accessToken: ${accessToken}`,
    );
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async login(loginInput: LoginInput, res?: Response): Promise<AuthResponse> {
    const { email, password } = loginInput;

    // Validate user credentials
    const user = await this.validateUser(email, password);

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user);

    // Set tokens in cookies if response object is provided
    if (res) {
      this.setTokenCookies(res, accessToken, refreshToken);
    }

    this.logger.log(
      `User ${user.email} logged in successfully, with accessToken: ${accessToken}`,
    );
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(
    refreshTokenInput: RefreshTokenInput,
    res?: Response,
  ): Promise<AuthResponse> {
    try {
      // Get refresh token from request input or cookies
      const refreshToken =
        refreshTokenInput.refreshToken ||
        (res && res.req.cookies && res.req.cookies.refresh_token);

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is required');
      }

      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Validate the user from the payload
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } =
        this.generateTokens(user);

      // Set new tokens in cookies if response object is provided
      if (res) {
        this.setTokenCookies(res, accessToken, newRefreshToken);
      }

      this.logger.log(
        `User ${user.email} refreshed token successfully, with new token: ${accessToken}`,
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
        user,
      };
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`, error.stack);
      throw new UnauthorizedException('Failed to refresh token');
    }
  }

  async logout(res: Response): Promise<{ success: boolean; message: string }> {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/',
    });

    this.logger.log('User logged out and token cookies cleared');
    return {
      success: true,
      message: 'Logout successful',
    };
  }

  async validateGoogleUser(
    profile: any,
    res?: Response,
  ): Promise<AuthResponse> {
    const { email, firstName, lastName, picture } = profile;

    try {
      // Try to find the user by email
      const user = await this.userService.findByEmail(email);

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user);

      // Set tokens in cookies if response object is provided
      if (res) {
        this.setTokenCookies(res, accessToken, refreshToken);
      }

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      // User doesn't exist, create a new one
      const newUser = await this.userService.create({
        email,
        firstName,
        lastName,
        // Generate a random password for OAuth users
        password: Math.random().toString(36).slice(-8),
        avatarUrl: picture,
        // isEmailVerified: true,
      });

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(newUser);

      // Set tokens in cookies if response object is provided
      if (res) {
        this.setTokenCookies(res, accessToken, refreshToken);
      }

      this.logger.log(
        `User ${newUser.email} signed up successfully via Google, with accessToken: ${accessToken}`,
      );
      return {
        accessToken,
        refreshToken,
        user: newUser,
      };
    }
  }

  private generateTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload: JwtPayload = {
      sub: user._id,
      email: user.email,
      roles: user.roles,
    };

    // Generate access token with shorter expiration
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION') || '15m',
      secret: this.configService.get('JWT_SECRET'),
    });

    // Generate refresh token with longer expiration
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return { accessToken, refreshToken };
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  // Updated helper method to set both tokens in cookies
  private setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const secure = this.configService.get('NODE_ENV') === 'production';

    // Access token cookie - shorter expiration
    const accessTokenMaxAge =
      this.configService.get('JWT_EXPIRATION_MS') || 15 * 60 * 1000; // 15 minutes default

    // Refresh token cookie - longer expiration
    const refreshTokenMaxAge =
      this.configService.get('JWT_REFRESH_EXPIRATION_MS') ||
      7 * 24 * 60 * 60 * 1000; // 7 days default

    // Set access token cookie
    res.cookie('auth_token', accessToken, {
      httpOnly: true,
      secure: secure,
      sameSite: 'lax',
      maxAge: +accessTokenMaxAge,
      path: '/',
    });

    // Set refresh token cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: secure,
      sameSite: 'lax',
      maxAge: +refreshTokenMaxAge,
      path: '/',
    });
  }
}
