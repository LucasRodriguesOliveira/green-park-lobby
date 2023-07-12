import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  @ApiProperty({
    type: String,
    example: 'j.doe',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @MinLength(5)
  @ApiProperty({
    type: String,
    example: 'johndoepassword',
  })
  password: string;

  @IsNotEmpty()
  @IsInt()
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 1,
  })
  userTypeId: number;
}
