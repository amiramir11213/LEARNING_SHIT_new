import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from '../dto/DTOcreateuserdto';
import { UsersService } from '../services/users.service';
import { UpdateUserDTO } from '../dto/DTOupdateuser';
import { Roles } from '../../auth1/decorators/rolesdrecorator';
import { UserRole } from '../entities/UserEntity';
import { CurrentUser } from '../../auth1/decorators/currentuserdecorator';
import { JwtAuthGuard } from '../../auth1/guards/jwtguard';
import { RolesGuard } from '../../auth1/guards/rolesguard'; // импортируем RolesGuard
import type { AuthUser } from '../../auth1/types/authusertype';
import { AuthService } from '../../auth1/service/AuthService';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // POST /users – создание пользователя (административное).
  // Если вы решите оставить его, защитите для админа.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.usersService.createUser(createUserDTO);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard) // <-- только JwtAuthGuard
  getMe(@CurrentUser() user: AuthUser) {
    return this.usersService.findUserById(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(
    @CurrentUser() user: AuthUser,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.usersService.updateUser(user.id, updateUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard) // оба guard'а
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: number) {
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDTO) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number) {
    return this.usersService.removeUser(id);
  }
}