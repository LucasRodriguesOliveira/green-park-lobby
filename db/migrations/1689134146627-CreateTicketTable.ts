import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTicketTable1689134146627 implements MigrationInterface {
  private ticketTable: Table = new Table({
    name: 'ticket',
    columns: [
      {
        name: 'id',
        type: 'int',
        isGenerated: true,
        isNullable: false,
        isPrimary: true,
      },
      {
        name: 'name',
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
    await queryRunner.createTable(this.ticketTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.ticketTable);
  }
}
