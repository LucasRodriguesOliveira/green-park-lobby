import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissionSeed1689134860003 implements MigrationInterface {
  private tableName = 'permission';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert(this.tableName, { description: 'FIND' });
    await queryRunner.manager.insert(this.tableName, { description: 'CREATE' });
    await queryRunner.manager.insert(this.tableName, { description: 'LIST' });
    await queryRunner.manager.insert(this.tableName, { description: 'UPDATE' });
    await queryRunner.manager.insert(this.tableName, { description: 'DELETE' });
    await queryRunner.manager.insert(this.tableName, {
      description: 'REGISTER',
    });
    await queryRunner.manager.insert(this.tableName, {
      description: 'UPLOAD_TICKETS',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(this.tableName, {
      description: [
        'FIND',
        'CREATE',
        'LIST',
        'UPDATE',
        'DELETE',
        'REGISTER',
        'UPLOAD_TICKETS',
      ],
    });
  }
}
