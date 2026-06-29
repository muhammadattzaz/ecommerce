import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
  })
  @IsIn(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
  status: string;
}
