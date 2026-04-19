import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './AuthService';
import { AuthController } from '../controller/AuthController';
import { JwtStrategy } from './jwtstrategy';
import { RolesGuard } from '../guards/rolesguard';
import { ProfileEntity } from '../../users/entities/ProfileEntity';
import { UserEntity } from 'src/modules/users/entities/UserEntity';
import { OrdersEntity } from 'src/modules/orders/entities/OrdersEntity';
import { BooksEntity } from 'src/modules/books/entities/BooksEntity';
import { AuthorEntity } from 'src/modules/auth/entities/AuthorEntity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProfileEntity,
      OrdersEntity,
      BooksEntity,
      AuthorEntity,
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService, RolesGuard, JwtModule, PassportModule],
})
export class AuthModule {}
