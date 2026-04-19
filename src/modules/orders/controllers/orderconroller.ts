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
import { OrdersService } from '../services/OrdersService';
import { CreateOrderDTO } from '../dto/DTOcreateordersdto';
import { UpdateOrderDTO } from '../dto/DTOupdateorder';
import { JwtAuthGuard } from '../../auth1/guards/jwtguard';
import { CurrentUser } from '../../auth1/decorators/currentuserdecorator';
import type { AuthUser } from '../../auth1/types/authusertype';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Создание заказа – userId из токена
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createOrderDto: CreateOrderDTO,
    @CurrentUser() user: AuthUser,
  ) {
    return this.ordersService.create(createOrderDto, user.id);
  }

  // Список заказов – зависит от роли (логика в сервисе)
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: AuthUser) {
    return this.ordersService.findAll(user);
  }

  // Получение одного заказа – проверка прав в сервисе
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.ordersService.findById(id, user);
  }

  // Обновление заказа – проверка прав в сервисе
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDTO,
    @CurrentUser() user: AuthUser,
  ) {
    return this.ordersService.update(id, updateOrderDto, user);
  }

  // Удаление заказа – проверка прав в сервисе
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.ordersService.remove(id, user);
  }
}
