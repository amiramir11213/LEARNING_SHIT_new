import { IsString, IsEmail, IsInt, Min, Max, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  price: number;

  @IsNumber()
  publishedYear: number;

  @IsNumber()
  stock: number;

  @IsNumber()
  authorId: number;
}
