import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/UserEntity';
import { CreateUserDTO } from '../dto/DTOcreateuserdto';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from '../dto/DTOupdateuser';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDTO.email },
    });

    if (existingUser) {
      throw new ConflictException('That user already exists');
    }

    if (createUserDTO.age < 0) {
      throw new BadRequestException('Innappropriate age');
    }

    const savedUser = this.usersRepository.create(createUserDTO);
    return this.usersRepository.save(savedUser);
  }

  async findAllUsers() {
    return await this.usersRepository.find();
  }

  async findUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['orders'],
    });
    if (!user) {
      throw new NotFoundException(`That user doesnt exist`);
    }
    return user;
  }

  async updateUser(id: number, updateUserDTO: UpdateUserDTO) {
    await this.findUserById(id);
    if (updateUserDTO.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDTO.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }
    if (updateUserDTO.age !== undefined && updateUserDTO.age < 0) {
      throw new BadRequestException('Age cannot be negative');
    }
    await this.usersRepository.update(id, updateUserDTO);
    return this.findUserById(id);
  }



  async removeUser(id: number) {
    const user = await this.findUserById(id);

    await this.usersRepository.remove(user);

    return { success: true };
  }
}
