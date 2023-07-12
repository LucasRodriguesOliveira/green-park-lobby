import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class CreateUserSeed1689134500156 implements MigrationInterface {
  private tableName = 'user';
  private password = 'admin123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [userType] = await queryRunner.manager.query(
      'SELECT id FROM user_type',
    );

    const hashPassword = await bcrypt.hash(this.password, 10);

    await queryRunner.manager.insert(this.tableName, {
      username: 'admin',
      name: 'Administrator',
      password: hashPassword,
      userTypeId: userType.id,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(this.tableName, {
      username: 'admin',
    });
  }
}
