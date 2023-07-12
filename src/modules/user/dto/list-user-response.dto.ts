import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { User } from '../entity/user.entity';

export class ListUserResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'DEFAULT',
  })
  userType: string;

  static map({ id, name, userType }: User): ListUserResponseDto {
    return {
      id,
      name,
      userType: userType.description,
    };
  }

  static from(users: User[]): ListUserResponseDto[] {
    return users.map((user) => ListUserResponseDto.map(user));
  }
}
