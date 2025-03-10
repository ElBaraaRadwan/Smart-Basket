import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user-entity';
import { JwtPayload } from './interface/jwt-payload.interface';
import { SignupInput, AuthResponse, LoginInput } from './dto';

@Injectable()
export class AuthService {
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

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    // Create user
    const user = await this.userService.create({
      ...signupInput,
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      accessToken: token,
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    // Validate user credentials
    const user = await this.validateUser(email, password);

    // Generate token
    const token = this.generateToken(user);

    return {
      accessToken: token,
      user,
    };
  }

  async validateGoogleUser(profile: any): Promise<AuthResponse> {
    const { email, firstName, lastName, picture } = profile;

    try {
      // Try to find the user by email
      const user = await this.userService.findByEmail(email);

      // Generate token
      const token = this.generateToken(user);

      return {
        accessToken: token,
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

      // Generate token
      const token = this.generateToken(newUser);

      return {
        accessToken: token,
        user: newUser,
      };
    }
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user._id,
      email: user.email,
      roles: user.roles,
    };

    return this.jwtService.sign(payload);
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
