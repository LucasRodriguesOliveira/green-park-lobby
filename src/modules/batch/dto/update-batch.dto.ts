import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateBatchDto {
  @ApiProperty({
    type: String,
    example: 'Marcos Roberto',
    required: true,
  })
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string;
}
