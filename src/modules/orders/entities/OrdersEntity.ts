import {
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Entity,
} from 'typeorm';
import { UserEntity } from '../../users/entities/UserEntity';
import { OrderStatus } from '../../../core/types/orderstatystype';
import { BooksEntity } from '../../books/entities/BooksEntity';

@Entity({ name: 'orders' })
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: OrderStatus;

  @Column()
  totalPrice: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  userId: UserEntity;

  @ManyToMany(() => BooksEntity, (book) => book.orders)
  @JoinTable({ name: 'orders_books' })
  books: BooksEntity[];
}
