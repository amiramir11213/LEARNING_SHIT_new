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
import { CreateBookDto } from '../dto/DTOcreatebook';
import { BookService } from '../services/BookService';
import { UpdateBookDTO } from '../dto/DTOupdatebooks';
import { CreateOrderDTO } from '../../orders/dto/DTOcreateordersdto';
import { JwtAuthGuard } from '../../auth1/guards/jwtguard';
import { RolesGuard } from '../../auth1/guards/rolesguard';
import { Roles } from '../../auth1/decorators/rolesdrecorator';
import { UserRole } from 'src/modules/users/entities/UserEntity';
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() CreateBookDto: CreateBookDto) {
    return this.bookService.create(CreateBookDto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.bookService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bookService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':authorId')
  findbyAuthor(@Param('authorId') authorId: number) {
    return this.bookService.findByAuthor(authorId);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDTO,
  ) {
    return this.bookService.update(id, updateBookDto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }
}
