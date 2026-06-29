import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsInt, Min, Max } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ description: 'Product ObjectId' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ description: 'Quantity to add', minimum: 1, maximum: 99 })
  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number;
}
