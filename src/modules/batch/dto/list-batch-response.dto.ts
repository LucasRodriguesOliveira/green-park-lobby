import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { Batch } from '../entity/batch.entity';

export class ListBatchResponseDto {
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

  static map({ id, name }: Batch): ListBatchResponseDto {
    return {
      id,
      name,
    };
  }

  static from(batches: Batch[]): ListBatchResponseDto[] {
    return batches.map(ListBatchResponseDto.map);
  }
}
