import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../../../core/types/orderstatystype';

export class UpdateOrderDTO {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
