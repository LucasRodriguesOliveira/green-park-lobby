import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTypeSeed1689134310288 implements MigrationInterface {
  private tableName = 'user_type';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert(this.tableName, {
      description: 'ADMIN',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(this.tableName, {
      description: 'ADMIN',
    });
  }
}
