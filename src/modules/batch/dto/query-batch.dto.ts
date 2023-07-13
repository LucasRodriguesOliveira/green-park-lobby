import { ApiProperty } from '@nestjs/swagger';
import { BatchStatus } from '../type/batch-status.enum';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryBatchDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    type: BatchStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(BatchStatus)
  status?: BatchStatus;
}
