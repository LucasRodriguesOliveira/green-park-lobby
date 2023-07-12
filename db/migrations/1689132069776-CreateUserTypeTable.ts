import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTypeTable1689132069776 implements MigrationInterface {
  private userTypeTable: Table = new Table({
    name: 'user_type',
    columns: [
      {
        name: 'id',
        type: 'int',
        isGenerated: true,
        isPrimary: true,
        isNullable: false,
        generationStrategy: 'increment',
      },
      {
        name: 'description',
        type: 'varchar',
        length: '100',
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
    await queryRunner.createTable(this.userTypeTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.userTypeTable);
  }
}
