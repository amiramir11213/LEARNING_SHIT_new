import { IsString, IsEmail, IsInt, Min, Max } from 'class-validator';
import { Column } from 'typeorm';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @IsString()
  password: string;
}
