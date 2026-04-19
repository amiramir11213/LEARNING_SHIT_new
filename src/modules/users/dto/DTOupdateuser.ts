import { CreateUserDTO } from './DTOcreateuserdto';
import { IsEmail, IsInt, IsString, Max, Min, IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  age: number;
}
