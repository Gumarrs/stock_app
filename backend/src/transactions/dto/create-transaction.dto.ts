import {
  IsEnum,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  qty: number;
}

export class CreateTransactionDto {
  @IsEnum(['IN', 'OUT'])
  type: 'IN' | 'OUT';

  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
