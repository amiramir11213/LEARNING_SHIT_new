import { IsInt, IsNumber, IsArray, ArrayMinSize } from 'class-validator';

export class CreateOrderDTO {


  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  booklds: number[];
}
