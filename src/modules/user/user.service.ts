import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserWithPermissions } from './dto/find-user-with-permissions';
import { FindUserDto } from './dto/find-user.dto';
import { ListUserResponseDto } from './dto/list-user-response.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UserType } from '../user-type/entity/user-type.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
  ) {}

  public async list(
    queryUserDto: QueryUserDto,
  ): Promise<ListUserResponseDto[]> {
    let query = {};

    if (queryUserDto.name) {
      query = {
        name: queryUserDto.name,
      };
    }

    if (queryUserDto.username) {
      query = {
        username: queryUserDto.username,
      };
    }

    const users = await this.userRepository.find({
      select: {
        id: true,
        name: true,
        userType: {
          description: true,
        },
      },
      relations: {
        userType: true,
      },
      where: {
        ...query,
      },
    });

    return ListUserResponseDto.from(users);
  }

  public async find(userId: string): Promise<FindUserDto | null> {
    const user = await this.userRepository.findOneOrFail({
      select: {
        id: true,
        name: true,
        username: true,
        userType: {
          description: true,
        },
      },
      relations: {
        userType: true,
      },
      where: {
        id: userId,
      },
    });

    if (!user?.id) {
      return null;
    }

    return FindUserDto.from(user);
  }

  public async findWithPermissions(
    userId: string,
  ): Promise<FindUserWithPermissions> {
    const user = await this.userRepository.findOneOrFail({
      select: {
        id: true,
        name: true,
        userType: {
          id: true,
          description: true,
          permissionGroups: {
            id: true,
            permission: {
              id: true,
              description: true,
            },
            module: {
              id: true,
              description: true,
            },
          },
        },
      },
      where: { id: userId },
      relations: {
        userType: {
          permissionGroups: {
            permission: true,
            module: true,
          },
        },
      },
    });

    return FindUserWithPermissions.from(user);
  }

  public async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        password: true,
        userType: {
          description: true,
        },
      },
      relations: {
        userType: true,
      },
      where: {
        username,
      },
    });
  }

  public async create({
    name,
    password,
    userTypeId,
    username,
  }: CreateUserDto): Promise<User> {
    const userType = await this.userTypeRepository.findOneBy({
      id: userTypeId,
    });

    return this.userRepository.save({
      name,
      password,
      username,
      userType,
    });
  }

  public async update(
    userId: string,
    { name, password, userTypeId, username }: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    const userType = await this.userTypeRepository.findOneBy({
      id: userTypeId,
    });
    await this.userRepository.update(
      { id: userId },
      { name, password, username, userType },
    );

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        userType: true,
      },
    });

    return UpdateUserResponseDto.from(user);
  }

  public async delete(userId: string): Promise<boolean> {
    const { affected } = await this.userRepository.softDelete({ id: userId });

    return affected > 0;
  }

  public async hashPassword(password: string, salt?: string): Promise<string> {
    if (!salt) {
      salt = await bcrypt.genSalt();
    }

    return bcrypt.hash(password, salt);
  }

  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
