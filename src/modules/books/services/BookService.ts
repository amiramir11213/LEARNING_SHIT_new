import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookController } from '../controllers/bookcontroller';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksEntity } from '../entities/BooksEntity';
import { AuthorEntity } from '../../auth/entities/AuthorEntity';
import { CreateBookDto } from '../dto/DTOcreatebook';
import { UpdateBookDTO } from '../dto/DTOupdatebooks';
import { UpdateAuthorDto } from '../../auth/dto/DTOupdateauthor';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BooksEntity)
    private bookRepository: Repository<BooksEntity>,
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BooksEntity> {
    // Валидация
    if (!createBookDto.name) {
      throw new BadRequestException('Book title is required');
    }
    if (createBookDto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }
    if (createBookDto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    // Находим автора
    const author = await this.authorRepository.findOne({
      where: { id: createBookDto.authorId },
    });
    if (!author) {
      throw new NotFoundException(
        `Author with id ${createBookDto.authorId} not found`,
      );
    }

    // Создаём объект книги с правильными полями
    const book = this.bookRepository.create({
      title: createBookDto.name, // DTO.name -> сущность.title
      description: createBookDto.description,
      price: createBookDto.price, // если price в сущности number
      published_year: createBookDto.publishedYear, // DTO.publishedYear -> сущность.published_year
      stock: createBookDto.stock,
      author: author, // передаём объект AuthorEntity
    });

    return this.bookRepository.save(book);
  }

  async findAll(): Promise<BooksEntity[]> {
    return this.bookRepository.find({ relations: ['author'] });
  }

  async findOne(id: number): Promise<BooksEntity> {
    const book = await this.bookRepository.findOne({
      where: { id: id },
      relations: ['author'],
    });
    if (!book) {
      throw new NotFoundException('There is no book found');
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDTO): Promise<BooksEntity> {
    const book = await this.bookRepository.findOne({ where: { id: id } });
    if (!book) {
      throw new NotFoundException('There is no book found');
    }
    if (updateBookDto.price !== undefined && updateBookDto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }
    if (updateBookDto.stock !== undefined && updateBookDto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    if (updateBookDto.authorId) {
      const author = await this.authorRepository.findOne({
        where: { id: updateBookDto.authorId },
      });
      if (!author) {
        throw new NotFoundException(
          `Author with id ${updateBookDto.authorId} not found`,
        );
      }
      book.author = author;
    }
    Object.assign(book, updateBookDto);
    return this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.bookRepository.findOne({ where: { id: id } });
    if (!book) {
      throw new NotFoundException('There is no book found');
    }
    await this.bookRepository.remove(book);
  }

  async findByAuthor(authorId: number): Promise<BooksEntity[]> {
    return this.bookRepository.find({
      where: { author: { id: authorId } },
      relations: ['author'],
    });
  }
}
