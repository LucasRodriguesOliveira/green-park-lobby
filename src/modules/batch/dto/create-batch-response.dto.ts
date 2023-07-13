import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { Batch } from '../entity/batch.entity';

export class CreateBatchResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'José da Silva',
  })
  name: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  status: boolean;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({ id, name, status, createdAt }: Batch): CreateBatchResponseDto {
    return {
      id,
      name,
      status,
      createdAt,
    };
  }
}
