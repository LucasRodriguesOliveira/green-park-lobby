import { ApiProperty } from '@nestjs/swagger';
import { randomBytes, randomInt } from 'crypto';
import { Batch } from '../../batch/entity/batch.entity';
import { Ticket } from '../entity/ticket.entity';

class ListTicketBatch {
  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: '0017',
  })
  name: string;

  static from({ id, name }: Batch): ListTicketBatch {
    return {
      id,
      name,
    };
  }
}

export class ListTicketResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'JOSÉ DA SILVA',
  })
  name: string;

  @ApiProperty({
    type: ListTicketBatch,
  })
  batch: ListTicketBatch;

  @ApiProperty({
    type: Number,
    example: 100,
  })
  value: number;

  @ApiProperty({
    type: String,
    example: randomBytes(10).toString('ascii'),
  })
  code: string;

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

  static map({
    id,
    name,
    batch,
    value,
    code,
    status,
    createdAt,
  }: Ticket): ListTicketResponseDto {
    return {
      id,
      name,
      batch: ListTicketBatch.from(batch),
      value,
      code,
      status,
      createdAt,
    };
  }

  static from(tickets: Ticket[]): ListTicketResponseDto[] {
    return tickets.map(ListTicketResponseDto.map);
  }
}
