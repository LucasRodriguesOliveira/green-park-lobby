import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateBatchDto {
  @ApiProperty({
    type: String,
    example: '0017',
    required: true,
  })
  @IsString()
  @MaxLength(100)
  name: string;
}
