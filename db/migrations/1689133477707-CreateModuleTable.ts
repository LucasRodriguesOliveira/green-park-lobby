import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateModuleTable1689133477707 implements MigrationInterface {
  private moduleTable: Table = new Table({
    name: 'module',
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
    await queryRunner.createTable(this.moduleTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.moduleTable);
  }
}
