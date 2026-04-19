import { IsString, IsEmail, IsInt, Min, Max } from 'class-validator';

export class CreateAuthorDTO {
  @IsString()
  name: string;

  @IsString()
  country: string;

  @IsInt()
  @Min(-6000)
  @Max(new Date().getFullYear())
  birthYear: number;
}
