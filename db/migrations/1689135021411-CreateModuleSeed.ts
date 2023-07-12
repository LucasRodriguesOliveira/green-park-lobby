import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModuleSeed1689135021411 implements MigrationInterface {
  private tableName = 'module';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert(this.tableName, {
      description: 'auth',
    });
    await queryRunner.manager.insert(this.tableName, {
      description: 'module',
    });
    await queryRunner.manager.insert(this.tableName, {
      description: 'permission',
    });
    await queryRunner.manager.insert(this.tableName, {
      description: 'user_type',
    });
    await queryRunner.manager.insert(this.tableName, {
      description: 'user',
    });
    await queryRunner.manager.insert(this.tableName, {
      description: 'batch',
    });
    await queryRunner.manager.insert(this.tableName, {
      description: 'ticket',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(this.tableName, {
      description: [
        'auth',
        'module',
        'permission',
        'user_type',
        'user',
        'batch',
        'ticket',
      ],
    });
  }
}
