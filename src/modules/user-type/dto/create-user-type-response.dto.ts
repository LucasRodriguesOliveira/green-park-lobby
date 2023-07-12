import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../entity/user-type.entity';
import { randomInt } from 'crypto';

export class CreateUserTypeResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'SALES',
  })
  description: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({
    id,
    description,
    createdAt,
  }: UserType): CreateUserTypeResponseDto {
    return {
      id,
      description,
      createdAt,
    };
  }
}
