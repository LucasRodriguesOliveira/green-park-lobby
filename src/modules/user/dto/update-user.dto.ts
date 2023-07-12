import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MaxLength(50)
  @MinLength(3)
  @ApiProperty({
    type: String,
    example: 'John',
  })
  name?: string;

  @IsOptional()
  @MaxLength(50)
  @MinLength(3)
  @ApiProperty({
    type: String,
    example: 'j.doe',
  })
  username?: string;

  @IsOptional()
  @MaxLength(150)
  @MinLength(5)
  @ApiProperty({
    type: String,
    example: 'newpassword',
  })
  password?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    type: Number,
    example: 7,
  })
  userTypeId?: number;
}
