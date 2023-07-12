import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../entity/user-type.entity';
import { randomInt } from 'crypto';

export class UpdateUserTypeResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'CLIENT',
  })
  description: string;

  static from({ id, description }: UserType): UpdateUserTypeResponseDto {
    return {
      id,
      description,
    };
  }
}
