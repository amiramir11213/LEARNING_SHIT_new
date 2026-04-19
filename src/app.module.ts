import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/modules/users/entities/ProfileEntity';
import { UserEntity } from 'src/modules/users/entities/UserEntity';
import { OrdersEntity } from 'src/modules/orders/entities/OrdersEntity';
import { BooksEntity } from 'src/modules/books/entities/BooksEntity';
import { AuthorEntity } from 'src/modules/auth/entities/AuthorEntity';
import { AuthModule } from './modules/auth1/service/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'amiramir29',
      database: 'leatning_shit',
      autoLoadEntities: true, // вместо entities: [...]
      synchronize: true,
    }),
  ],
})

// ... внутри TypeOrmModule.forRoot
export class AppModule {}
