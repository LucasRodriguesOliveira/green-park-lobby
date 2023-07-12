import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    type: String,
    required: false,
    example: 'John',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    type: String,
    required: false,
    example: 'j.doe',
  })
  username?: string;
}
