import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../entity/user-type.entity';
import { randomInt } from 'crypto';

export class ListUserTypeResponseDto {
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

  static map({ id, description }: UserType): ListUserTypeResponseDto {
    return {
      id,
      description,
    };
  }

  static from(userTypeList: UserType[]): ListUserTypeResponseDto[] {
    return userTypeList.map(ListUserTypeResponseDto.map);
  }
}
