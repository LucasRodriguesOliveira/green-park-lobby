import { User } from '../entity/user.entity';

export interface UserResult {
  id: string;
  name: string;
  username: string;
  userType: string;
}

export class UserResultDto {
  static from({ id, name, userType, username }: User): UserResult {
    return {
      id,
      name,
      userType: userType.description,
      username,
    };
  }
}
