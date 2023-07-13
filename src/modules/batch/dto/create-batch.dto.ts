import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBatchDto {
  @ApiProperty({
    type: String,
    example: 'José da Silva',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;
}
