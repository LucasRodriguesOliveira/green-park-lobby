import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { Batch } from '../entity/batch.entity';

export class UpdateBatchResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Marcos Roberto',
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

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({
    id,
    name,
    status,
    createdAt,
    updatedAt,
  }: Batch): UpdateBatchResponseDto {
    return {
      id,
      name,
      status,
      createdAt,
      updatedAt,
    };
  }
}
