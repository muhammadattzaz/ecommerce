import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ description: 'New quantity (0 removes the item)' })
  @IsInt()
  @Min(0)
  @Max(99)
  quantity: number;
}
