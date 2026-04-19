import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksEntity } from '../../books/entities/BooksEntity';
import { AuthorEntity } from '../../auth/entities/AuthorEntity';
import { CreateAuthorDTO } from '../../auth/dto/DTOcreateauthor';
import { UpdateAuthorDto } from '../../auth/dto/DTOupdateauthor';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(BooksEntity)
    private bookRepository: Repository<BooksEntity>,
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>,
  ) {}

  async create(CreateAuthorDTO: CreateAuthorDTO): Promise<AuthorEntity> {
    if (!CreateAuthorDTO.name) {
      throw new NotFoundException('Wrong Name');
    }
    if (
      CreateAuthorDTO.birthYear === undefined ||
      CreateAuthorDTO.birthYear < 6000 ||
      CreateAuthorDTO.birthYear > new Date().getFullYear()
    ) {
      throw new BadRequestException('Wrong Birth Year');
    }
    const author = this.authorRepository.create(CreateAuthorDTO);
    return this.authorRepository.save(author);
  }

  async findAll(): Promise<AuthorEntity[]> {
    return this.authorRepository.find();
  }

  async findOne(id: number): Promise<AuthorEntity> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });
    if (!author) {
      throw new NotFoundException(`Author is not found`);
    }
    return author;
  }

  async update(
    id: number,
    UpdateAuthorDto: UpdateAuthorDto,
  ): Promise<AuthorEntity> {
    const author = await this.authorRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
    if (
      UpdateAuthorDto.birthYear === undefined ||
      UpdateAuthorDto.birthYear < 6000 ||
      UpdateAuthorDto.birthYear > new Date().getFullYear()
    ) {
      throw new BadRequestException('Wrong Birth Year');
    }
    Object.assign(author, UpdateAuthorDto);
    return this.authorRepository.save(author);
  }

  async remove(id: number): Promise<void> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });
    if (!author) {
      throw new NotFoundException(`Author is not found`);
    }
    await this.authorRepository.remove(author);
  }
}
