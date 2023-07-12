import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1689132595646 implements MigrationInterface {
  private userTable: Table = new Table({
    name: 'user',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isGenerated: true,
        isPrimary: true,
        isNullable: false,
        generationStrategy: 'uuid',
      },
      {
        name: 'name',
        type: 'varchar',
        length: '100',
        isNullable: false,
      },
      {
        name: 'username',
        type: 'varchar',
        length: '50',
        isNullable: false,
      },
      {
        name: 'password',
        type: 'varchar',
        length: '150',
        isNullable: false,
      },
      {
        name: 'userTypeId',
        type: 'int',
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
    await queryRunner.createTable(this.userTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.userTable);
  }
}
