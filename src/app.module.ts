import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env/env.config';
import { TypeOrmPostgresModule } from './modules/typeorm/typeorm.module';
import { UserTypeModule } from './modules/user-type/user-type.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ModuleModule } from './modules/module/module.module';
import { PermissionGroupModule } from './modules/permission-group/permission-group.module';
import { BatchModule } from './modules/batch/batch.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeOrmPostgresModule,
    AuthModule,
    UserTypeModule,
    UserModule,
    PermissionModule,
    ModuleModule,
    PermissionGroupModule,
    BatchModule,
  ],
})
export class AppModule {}
