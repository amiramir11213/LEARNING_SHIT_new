import { IsNotEmpty, IsString, Min } from 'class-validator';
export class UpdatePasswordDTO {
  @IsString()
  @IsNotEmpty()
  @Min(6)
  newPassword: string;
}