import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissionGroupSeed1689135245029
  implements MigrationInterface
{
  private tableName = 'permission_group';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = await queryRunner.manager.query('SELECT id FROM module');
    const permissions = await queryRunner.manager.query(
      'SELECT id from permission',
    );
    const [userType] = await queryRunner.manager.query(
      'SELECT id FROM user_type',
    );
    const permissionGroups = [];

    for (const module of modules) {
      for (const permission of permissions) {
        permissionGroups.push({
          userTypeId: userType.id,
          permissionId: permission.id,
          moduleId: module.id,
        });
      }
    }

    for (const permissionGroup of permissionGroups) {
      await queryRunner.manager.insert(this.tableName, permissionGroup);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(this.tableName, {});
  }
}
