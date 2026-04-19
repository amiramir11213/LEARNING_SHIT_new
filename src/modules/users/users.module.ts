import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UserEntity } from './entities/UserEntity';
import { ProfileEntity } from './entities/ProfileEntity';
import { UsersService } from './services/users.service';
import { AuthModule } from '../auth1/service/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity]), AuthModule],

  controllers: [UsersController], // ← обязательно
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
