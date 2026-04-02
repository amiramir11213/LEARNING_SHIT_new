import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserBodyDto } from '../dto/create/createUser.body.dto';
import { CreateUserParamsDto } from '../dto/create/createUser.params.dto';
import { FindAllUsersParamsDto } from '../dto/findAll/findAllUsers.params.dto';
import { FindOneUserParamsDto } from '../dto/findOne/findOneUser.params.dto';
import { RemoveUserParamsDto } from '../dto/remove/removeUser.params.dto';
import { UpdateUserBodyDto } from '../dto/update/updateUser.body.dto';
import { UpdateUserParamsDto } from '../dto/update/updateUser.params.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Param() _params: CreateUserParamsDto,
    @Body() body: CreateUserBodyDto,
  ) {
    return this.usersService.createUser(body);
  }

  @Get()
  async findAllUsers(@Param() _params: FindAllUsersParamsDto) {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  async findUserById(@Param() params: FindOneUserParamsDto) {
    return this.usersService.findUserById(params.id);
  }

  @Patch(':id')
  async updateUser(
    @Param() params: UpdateUserParamsDto,
    @Body() body: UpdateUserBodyDto,
  ) {
    return this.usersService.updateUser(params.id, body);
  }

  @Delete(':id')
  async removeUser(@Param() params: RemoveUserParamsDto) {
    return this.usersService.removeUser(params.id);
  }
}
