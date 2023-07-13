import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

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
        name: 'batchId',
        type: 'int',
        isNullable: false,
      },
      {
        name: 'value',
        type: 'decimal',
        precision: 10,
        scale: 4,
        isNullable: false,
      },
      {
        name: 'code',
        type: 'varchar',
        length: '255',
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
    await queryRunner.createTable(this.ticketTable);
    await queryRunner.createForeignKey(
      this.ticketTable,
      new TableForeignKey({
        name: 'Ticket_Batch_fk',
        columnNames: ['batchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'batch',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.ticketTable);
  }
}
