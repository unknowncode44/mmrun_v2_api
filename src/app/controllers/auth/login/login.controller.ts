import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('login')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() loginDto: LoginDto) {
    console.log(loginDto);
    return this.authService.login(loginDto);
  }

  @Post('protected')
  @UseGuards(AuthGuard('jwt'))
  async protectedRoute() {
    // This route requires a valid JWT token
    // Add your protected route logic here
  }
}