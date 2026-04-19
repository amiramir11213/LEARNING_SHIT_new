import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateAuthorDTO } from '../dto/DTOcreateauthor';
import { UpdateAuthorDto } from '../dto/DTOupdateauthor';
import { AuthorService } from '../services/AuthorService';
import { JwtAuthGuard } from '../../auth1/guards/jwtguard';
import { RolesGuard } from '../../auth1/guards/rolesguard';
import { Roles } from '../../auth1/decorators/rolesdrecorator';
import { UserRole } from '../../users/entities/UserEntity';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() CreateAuthorDto: CreateAuthorDTO) {
    return this.authorService.create(CreateAuthorDto);
  }

  @Get()
  findAll() {
    return this.authorService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.authorService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: number, @Body() UpdateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(id, UpdateAuthorDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.authorService.remove(id);
  }
}
