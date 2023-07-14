import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { Batch } from '../../batch/entity/batch.entity';
import { Ticket } from '../entity/ticket.entity';

class CreateTicketBatch {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  static from({ id }: Batch): CreateTicketBatch {
    return {
      id,
    };
  }
}

export class CreateTicketResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'JOSÉ DA SILVA',
  })
  name: string;

  @ApiProperty({
    type: CreateTicketBatch,
  })
  batch: CreateTicketBatch;

  @ApiProperty({
    type: Number,
    example: randomInt(100, 500),
  })
  value: number;

  @ApiProperty({
    type: String,
    example: '1234560987123',
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
  }: Ticket): CreateTicketResponseDto {
    return {
      id,
      name,
      batch: CreateTicketBatch.from(batch),
      value,
      code,
      status,
      createdAt,
    };
  }

  static from(tickets: Ticket[]): CreateTicketResponseDto[] {
    return tickets.map(CreateTicketResponseDto.map);
  }
}
