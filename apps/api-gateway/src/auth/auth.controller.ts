import { Body, Controller, Post, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Version('1')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() body: Record<string, unknown>) {
    return this.authService.register(body);
  }

  @Post('login')
  @Version('1')
  @ApiOperation({ summary: 'Login a user' })
  async login(@Body() body: Record<string, unknown>) {
    return this.authService.login(body);
  }
}
