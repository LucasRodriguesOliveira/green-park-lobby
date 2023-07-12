import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserTypeResponseDto } from './dto/create-user-type-response.dto';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { FindUserTypeResponseDto } from './dto/find-user-type.dto';
import { ListUserTypeResponseDto } from './dto/list-user-type-response.dto';
import { UpdateUserTypeResponseDto } from './dto/update-user-type-response.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UserType } from './entity/user-type.entity';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
  ) {}

  public async list(): Promise<ListUserTypeResponseDto[]> {
    const userTypeList = await this.userTypeRepository.find({
      select: ['id', 'description'],
    });

    return ListUserTypeResponseDto.from(userTypeList);
  }

  public async find(userTypeId: number): Promise<FindUserTypeResponseDto> {
    const userType = await this.userTypeRepository.findOneByOrFail({
      id: userTypeId,
    });

    return FindUserTypeResponseDto.from(userType);
  }

  public async create(
    createUserTypeDto: CreateUserTypeDto,
  ): Promise<CreateUserTypeResponseDto> {
    const userType = await this.userTypeRepository.save(createUserTypeDto);

    return CreateUserTypeResponseDto.from(userType);
  }

  public async update(
    userTypeId: number,
    updateUserTypeDto: UpdateUserTypeDto,
  ): Promise<UpdateUserTypeResponseDto> {
    await this.userTypeRepository.update({ id: userTypeId }, updateUserTypeDto);
    const userType = await this.userTypeRepository.findOneBy({
      id: userTypeId,
    });

    return UpdateUserTypeResponseDto.from(userType);
  }

  public async delete(userTypeId: number): Promise<boolean> {
    const { affected } = await this.userTypeRepository.softDelete({
      id: userTypeId,
    });

    return affected > 0;
  }
}
