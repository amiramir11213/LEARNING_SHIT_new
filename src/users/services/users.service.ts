import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserBodyDto } from '../dto/create/createUser.body.dto';
import { Repository } from 'typeorm';
import { UpdateUserBodyDto } from '../dto/update/updateUser.body.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(body: CreateUserBodyDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    const savedUser = await this.usersRepository.save(user);

    return this.toUserResponse(savedUser);
  }

  async findAllUsers() {
    return await this.usersRepository.find();
  }

  async findUserById(id: number) {
    const user = await this.findExistingUser(id);

    return this.toUserResponse(user);
  }

  async updateUser(id: number, body: UpdateUserBodyDto) {
    const user = await this.findExistingUser(id);

    if (body.email && body.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: body.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const updatedUser = await this.usersRepository.save(
      this.usersRepository.merge(user, body),
    );

    return this.toUserResponse(updatedUser);
  }

  async removeUser(id: number) {
    const user = await this.findExistingUser(id);

    await this.usersRepository.remove(user);

    return { success: true };
  }

  private async findExistingUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  private toUserResponse(user: UserEntity) {
    const { password, ...userResponse } = user;

    return userResponse;
  }
}
