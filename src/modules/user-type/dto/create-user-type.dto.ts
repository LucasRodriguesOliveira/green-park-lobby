import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserTypeDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    type: String,
    required: true,
  })
  description: string;
}
