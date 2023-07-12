import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePermissionTable1689133146682 implements MigrationInterface {
  private permissionTable: Table = new Table({
    name: 'permission',
    columns: [
      {
        name: 'id',
        type: 'int',
        isGenerated: true,
        isNullable: false,
        isPrimary: true,
        generationStrategy: 'increment',
      },
      {
        name: 'description',
        type: 'varchar',
        length: '50',
        isNullable: false,
      },
      {
        name: 'createdAt',
        type: 'timestamp',
        isNullable: false,
        default: 'now()',
      },
      {
        name: 'updatedAt',
        type: 'timestamp',
        isNullable: false,
        default: 'now()',
      },
      {
        name: 'deletedAt',
        type: 'timestamp',
        isNullable: true,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.permissionTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.permissionTable);
  }
}
