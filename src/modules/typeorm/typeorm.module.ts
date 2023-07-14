import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleConfig } from '../../config/typeorm/typeorm-module.config';
import { UserType } from '../user-type/entity/user-type.entity';
import { User } from '../user/entity/user.entity';
import { Module as ModuleEntity } from '../module/entity/module.entity';
import { Permission } from '../permission/entity/permission.entity';
import { PermissionGroup } from '../permission-group/entity/permission-group.entity';
import { Batch } from '../batch/entity/batch.entity';
import { Ticket } from '../ticket/entity/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(
      typeOrmModuleConfig([
        UserType,
        User,
        ModuleEntity,
        Permission,
        PermissionGroup,
        Batch,
        Ticket,
      ]),
    ),
  ],
})
export class TypeOrmPostgresModule {}
