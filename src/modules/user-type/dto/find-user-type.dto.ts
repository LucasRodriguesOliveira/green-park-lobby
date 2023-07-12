import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../entity/user-type.entity';
import { randomInt } from 'crypto';

export class FindUserTypeResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'DEFAULT',
  })
  description: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({
    id,
    description,
    createdAt,
    updatedAt,
  }: UserType): FindUserTypeResponseDto {
    return {
      id,
      description,
      createdAt,
      updatedAt,
    };
  }
}
