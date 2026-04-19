import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from '../dto/registerDTO';
import { LoginDto } from '../dto/loginDTO';
import { AuthService } from '../service/AuthService';
import type { AuthUser } from '../types/authusertype';
import { JwtAuthGuard } from '../guards/jwtguard';
import { CurrentUser } from '../decorators/currentuserdecorator';
import { UpdatePasswordDTO} from '../dto/UpdatePasswordDTO';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.authService.getMe(user.id);
  }

  @Patch('changePassword')
  @UseGuards(JwtAuthGuard)
  update(
    @CurrentUser() user: AuthUser,
    @Body() UpdatePasswordDTO: UpdatePasswordDTO,
  ) {
    return this.authService.changePassword(user.id, UpdatePasswordDTO);
  }
}
