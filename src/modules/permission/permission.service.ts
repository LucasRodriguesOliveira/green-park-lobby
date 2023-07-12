import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionResponse } from './dto/create-permission-response.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionResponse } from './dto/update-permission-response.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entity/permission.entity';
import { ListPermissionDto } from './dto/list-permission.dto';
import { FindPermissionDto } from './dto/find-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  public async find(id: number): Promise<FindPermissionDto | null> {
    const permission = await this.permissionRepository.findOneOrFail({
      where: { id },
      select: ['id', 'description', 'createdAt'],
    });

    return FindPermissionDto.from(permission);
  }

  public async list(): Promise<ListPermissionDto[]> {
    const permissionList = await this.permissionRepository.find({
      select: ['id', 'description'],
    });

    return permissionList.map((permission) =>
      ListPermissionDto.from(permission),
    );
  }

  public async create({
    description,
  }: CreatePermissionDto): Promise<CreatePermissionResponse> {
    const permission = await this.permissionRepository.save({
      description,
    });

    return CreatePermissionResponse.from(permission);
  }

  public async update(
    id: number,
    { description }: UpdatePermissionDto,
  ): Promise<UpdatePermissionResponse> {
    await this.permissionRepository.update({ id }, { description });

    const permission = await this.permissionRepository.findOne({
      where: { id },
      select: ['id', 'description', 'createdAt', 'updatedAt'],
    });

    return UpdatePermissionResponse.from(permission);
  }

  public async delete(id: number): Promise<boolean> {
    const { affected } = await this.permissionRepository.softDelete({ id });

    return affected > 0;
  }
}
