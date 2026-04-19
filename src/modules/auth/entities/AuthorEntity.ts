import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BooksEntity } from '../../books/entities/BooksEntity';

@Entity({ name: 'author' })
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @CreateDateColumn()
  birthDate: Date;

  @OneToMany(() => BooksEntity, (book) => book.author)
  books: BooksEntity[];

  @UpdateDateColumn()
  createdAt: Date;
}
