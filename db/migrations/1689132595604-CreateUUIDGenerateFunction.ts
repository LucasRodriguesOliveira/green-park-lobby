import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUUIDGenerateFunction1689132595604
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.uuid_generate_v4()
      RETURNS uuid
      LANGUAGE c
      PARALLEL SAFE STRICT
      AS '$libdir/uuid-ossp', $function$uuid_generate_v4$function$
   `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP FUNCTION public.uuid_generate_v4
    `);
  }
}
