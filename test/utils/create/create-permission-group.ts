import { FindPermissionGroupDto } from '../../../src/modules/permission-group/dto/find-permission-group.dto';
import { CreatePermissionGroupDto } from '../../../src/modules/permission-group/dto/create-permission-group.dto';
import { createUserType } from './create-user-type';
import { createModule } from './create-module';
import { createPermission } from './create-permission';
import { PermissionGroupController } from '../../../src/modules/permission-group/permission-group.controller';
import { PermissionController } from '../../../src/modules/permission/permission.controller';
import { ModuleController } from '../../../src/modules/module/module.controller';
import { UserTypeController } from '../../../src/modules/user-type/user-type.controller';

interface CreatePermissionGroupOptions {
  permissionGroupController: PermissionGroupController;
  permissionController: PermissionController;
  moduleController: ModuleController;
  userTypeController: UserTypeController;
}

export async function createPermissionGroup({
  permissionGroupController,
  permissionController,
  moduleController,
  userTypeController,
}: CreatePermissionGroupOptions): Promise<FindPermissionGroupDto> {
  const [{ id: userTypeId }, { id: moduleId }, { id: permissionId }] =
    await Promise.all([
      createUserType({ userTypeController }),
      createModule({ moduleController }),
      createPermission({ permissionController }),
    ]);

  const createPermissionGroupDto: CreatePermissionGroupDto = {
    userTypeId,
    moduleId,
    permissionId,
  };

  return permissionGroupController.create(createPermissionGroupDto);
}
