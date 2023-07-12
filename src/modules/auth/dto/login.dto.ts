import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Min(3)
  @Max(50)
  @ApiProperty({ example: 'j.doe' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Min(5)
  @ApiProperty({ example: 'mypass123' })
  password: string;
}
