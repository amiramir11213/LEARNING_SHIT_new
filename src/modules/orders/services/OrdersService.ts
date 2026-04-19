import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../users/entities/UserEntity';
import { CreateOrderDTO } from '../dto/DTOcreateordersdto';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../../core/types/orderstatystype';
import { BooksEntity } from '../../books/entities/BooksEntity';
import { UpdateOrderDTO } from '../dto/DTOupdateorder';
import { OrdersEntity } from '../entities/OrdersEntity';
import {CurrentUser} from '../../auth1/decorators/currentuserdecorator';
import { AuthUser} from '../../auth1/types/authusertype';
import {UserRole} from '../../users/entities/UserEntity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private orderRepository: Repository<OrdersEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(BooksEntity)
    private bookRepository: Repository<BooksEntity>,
  ) {}

  async create(
    createOrderDto: CreateOrderDTO,
    userId: number,
  ): Promise<OrdersEntity> {
    const { booklds } = createOrderDto;

    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new NotFoundException(`User is not found`);
    }

    const books = await this.bookRepository.findByIds(booklds);
    if (books.length != booklds.length) {
      const foundIds = books.map((b) => b.id);
      const missing = booklds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Books with ids "${missing.join(',')}" not found`,
      );
    }

    for (const book of books) {
      if (book.stock <= 0) {
        throw new NotFoundException(`Book is out of stock`);
      }
    }

    const totalPrice = books.reduce((sum, book) => sum + Number(book.price), 0);
    for (const book of books) {
      book.stock -= 1;
      await this.bookRepository.save(book);
    }

    const order = this.orderRepository.create({
      userId: user,
      status: OrderStatus.NEW,
      totalPrice,
      books,
    });

    return this.orderRepository.save(order);
  }

  async findAll(currentUser: AuthUser): Promise<OrdersEntity[]> {
    if (currentUser.role === UserRole.ADMIN) {

      return this.orderRepository.find({
        relations: ['user', 'books'],
      });
    } else {

      return this.orderRepository.find({
        where: { userId: { id: currentUser.id } },
        relations: ['books'],
      });
    }
  }

  async findById(id: number, currentUser: AuthUser): Promise<OrdersEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'books'],
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }


    if (
      currentUser.role !== UserRole.ADMIN &&
      order.userId.id !== currentUser.id
    ) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return order;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDTO,
    currentUser: AuthUser,
  ): Promise<OrdersEntity> {

    const order = await this.findById(id, currentUser);

    if (updateOrderDto.status) {
      // Валидация статуса
      if (!Object.values(OrderStatus).includes(updateOrderDto.status)) {
        throw new BadRequestException('Invalid status');
      }


      if (
        updateOrderDto.status === OrderStatus.CANCELLED &&
        order.status !== OrderStatus.CANCELLED
      ) {
        for (const book of order.books) {
          book.stock += 1;
          await this.bookRepository.save(book);
        }
      }
      order.status = updateOrderDto.status;
    }


    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }


  async remove(id: number, currentUser: AuthUser): Promise<void> {

    const order = await this.findById(id, currentUser);


    if (order.status !== OrderStatus.CANCELLED) {
      for (const book of order.books) {
        book.stock += 1;
        await this.bookRepository.save(book);
      }
    }

    await this.orderRepository.remove(order);
  }

  async findByUser(
    userId: number,
    currentUser: AuthUser,
  ): Promise<OrdersEntity[]> {

    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return this.orderRepository.find({
      where: { userId: { id: userId } },
      relations: ['books'],
    });
  }
}