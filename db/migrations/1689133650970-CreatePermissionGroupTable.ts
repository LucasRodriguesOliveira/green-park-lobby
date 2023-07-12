import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePermissionGroupTable1689133650970
  implements MigrationInterface
{
  private permissionGroupTable: Table = new Table({
    name: 'permission_group',
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
        name: 'userTypeId',
        type: 'int',
        isNullable: false,
      },
      {
        name: 'permissionId',
        type: 'int',
        isNullable: false,
      },
      {
        name: 'moduleId',
        type: 'int',
        isNullable: false,
      },
      {
        name: 'status',
        type: 'boolean',
        isNullable: false,
        default: true,
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
    await queryRunner.createTable(this.permissionGroupTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.permissionGroupTable);
  }
}
