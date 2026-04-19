import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthorEntity } from '../../auth/entities/AuthorEntity';
import { OrdersEntity } from '../../orders/entities/OrdersEntity';

@Entity({ name: 'books' })
export class BooksEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @CreateDateColumn()
  published_year: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  stock: number;

  @ManyToOne(() => AuthorEntity, (author) => author.books, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: AuthorEntity;

  @UpdateDateColumn()
  createdAt: Date;

  @ManyToMany(() => OrdersEntity, (order) => order.books)
  @JoinTable({ name: 'orders_books' })
  orders: OrdersEntity[];
}
