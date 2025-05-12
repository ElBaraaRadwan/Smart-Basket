import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  SignupInput,
  LoginInput,
  AuthResponse,
  RefreshTokenInput,
} from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async signup(
    @Args('signupInput') signupInput: SignupInput,
    @Context() context: any,
  ) {
    return this.authService.signup(signupInput, context.res);
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: any,
  ) {
    return this.authService.login(loginInput, context.res);
  }

  @Mutation(() => AuthResponse)
  async refreshToken(
    @Args('refreshTokenInput', { nullable: true })
    refreshTokenInput: RefreshTokenInput,
    @Context() context: any,
  ) {
    return this.authService.refreshToken(refreshTokenInput, context.res);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@Context() context: any) {
    const result = await this.authService.logout(context.res);
    return result.success;
  }
}
