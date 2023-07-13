import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { Module } from '../src/modules/module/entity/module.entity';
import { ModuleController } from '../src/modules/module/module.controller';
import { ModuleModule } from '../src/modules/module/module.module';
import { Permission } from '../src/modules/permission/entity/permission.entity';
import { PermissionController } from '../src/modules/permission/permission.controller';
import { PermissionModule } from '../src/modules/permission/permission.module';
import { CreatePermissionGroupDto } from '../src/modules/permission-group/dto/create-permission-group.dto';
import { FindPermissionGroupDto } from '../src/modules/permission-group/dto/find-permission-group.dto';
import { PermissionGroup } from '../src/modules/permission-group/entity/permission-group.entity';
import { PermissionGroupController } from '../src/modules/permission-group/permission-group.controller';
import { PermissionGroupModule } from '../src/modules/permission-group/permission-group.module';
import { TypeOrmPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { UserType } from '../src/modules/user-type/entity/user-type.entity';
import { UserTypeController } from '../src/modules/user-type/user-type.controller';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { User } from '../src/modules/user/entity/user.entity';
import { UserModule } from '../src/modules/user/user.module';
import { createModule } from './utils/create/create-module';
import { createPermission } from './utils/create/create-permission';
import { createPermissionGroup } from './utils/create/create-permission-group';
import { createUserType } from './utils/create/create-user-type';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';

describe('PermissionGroupController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/permission-group';
  const headers = {
    auth: 'authorization',
  };

  let userTypeController: UserTypeController;
  let permissionController: PermissionController;
  let moduleController: ModuleController;
  let permissionGroupController: PermissionGroupController;

  let repositoryManager: RepositoryManager;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeOrmPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        PermissionGroupModule,
        PermissionModule,
        ModuleModule,
      ],
    }).compile();

    userTypeController =
      moduleFixture.get<UserTypeController>(UserTypeController);
    permissionController =
      moduleFixture.get<PermissionController>(PermissionController);
    moduleController = moduleFixture.get<ModuleController>(ModuleController);
    permissionGroupController = moduleFixture.get<PermissionGroupController>(
      PermissionGroupController,
    );

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([
      new RepositoryItem(Module),
      new RepositoryItem(Permission),
      new RepositoryItem(UserType),
      new RepositoryItem(User),
      new RepositoryItem(PermissionGroup),
    ]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'PermissionGroup.e2e',
    });
  });

  afterAll(async () => {
    await getToken.clear();
    await app.close();
  });

  describe('/:permissionGroupId', () => {
    const path = `${basePath}/:permissionGroupId`;
    const pathTo = (id: number) => path.replace(/:permissionGroupId/, `${id}`);

    describe('(GET)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .get(pathTo(-1)) // since it will not be accessed, doesn't mattter if it exists or not
            .expect(HttpStatus.UNAUTHORIZED);
        });
      });

      describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
        let token: string;

        beforeAll(async () => {
          token = await getToken.default();
        });

        it('should not allow access to the route due to user type is not admin', () => {
          return request(app.getHttpServer())
            .get(pathTo(-1)) // since it will not be accessed, doesn't mattter if it exists or not
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let permissionGroup: FindPermissionGroupDto;
        let token: string;

        beforeAll(async () => {
          token = await getToken.admin();
          permissionGroup = await createPermissionGroup({
            userTypeController,
            moduleController,
            permissionController,
            permissionGroupController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(PermissionGroup.name, {
            id: permissionGroup.id,
          });
        });

        it('should find a Permission Group by Id', () => {
          return request(app.getHttpServer())
            .get(pathTo(permissionGroup.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', permissionGroup.id);
              expect(response.body).toHaveProperty('userType');
              expect(response.body).toHaveProperty('permission');
              expect(response.body).toHaveProperty('module');
            });
        });
      });

      describe(`NOT_FOUND - ${HttpStatus.NOT_FOUND}`, () => {
        let token: string;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        it('should not find a Permission Group by Id', () => {
          return request(app.getHttpServer())
            .get(pathTo(-1))
            .set(headers.auth, token)
            .expect(HttpStatus.NOT_FOUND);
        });
      });
    });

    describe('(DELETE)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow to access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .delete(pathTo(-1))
            .expect(HttpStatus.UNAUTHORIZED);
        });
      });

      describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
        let token: string;

        beforeEach(async () => {
          token = await getToken.default();
        });

        it('should not allow access due to user type is not admin', () => {
          return request(app.getHttpServer())
            .delete(pathTo(-1))
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        let permissionGroup: FindPermissionGroupDto;

        beforeAll(async () => {
          token = await getToken.admin();
          permissionGroup = await createPermissionGroup({
            userTypeController,
            moduleController,
            permissionController,
            permissionGroupController,
          });
        });

        afterAll(async () => {
          await Promise.all([
            repositoryManager.removeAndCheck(Permission.name, {
              id: permissionGroup.permission.id,
            }),
            repositoryManager.removeAndCheck(Module.name, {
              id: permissionGroup.module.id,
            }),
            repositoryManager.removeAndCheck(UserType.name, {
              id: permissionGroup.userType.id,
            }),
          ]);
        });

        it('should delete a permission group by id', () => {
          return request(app.getHttpServer())
            .delete(pathTo(permissionGroup.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(JSON.parse(response.text)).toBe(true);
            });
        });
      });
    });
  });

  describe('/all/user-types - (GET)', () => {
    const path = `${basePath}/all/user-types`;

    describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
      it('should not allow to access to the route without a jwt token', () => {
        return request(app.getHttpServer())
          .get(path)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
      let token: string;

      beforeEach(async () => {
        token = await getToken.default();
      });

      it('should not allow to access due to user type is not admin', () => {
        return request(app.getHttpServer())
          .get(path)
          .set(headers.auth, token)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe(`OK - ${HttpStatus.OK}`, () => {
      let token: string;
      let permissionGroup: FindPermissionGroupDto;

      beforeEach(async () => {
        token = await getToken.admin();
        permissionGroup = await createPermissionGroup({
          moduleController,
          permissionController,
          permissionGroupController,
          userTypeController,
        });
      });

      afterEach(async () => {
        await repositoryManager.removeAndCheck(PermissionGroup.name, {
          id: permissionGroup.id,
        });
      });

      it('should find all the user types in permission group table', () => {
        return request(app.getHttpServer())
          .get(path)
          .set(headers.auth, token)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toHaveProperty('length');
            expect(response.body.length).toBeGreaterThanOrEqual(1);
          });
      });
    });
  });

  describe('/:userTypeId/modules - (GET)', () => {
    const path = `${basePath}/:userTypeId/modules`;
    const pathTo = (id: number) => path.replace(/:userTypeId/, `${id}`);

    describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
      it('should not allow to access to the route without a jwt token', () => {
        return request(app.getHttpServer())
          .get(pathTo(-1))
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
      let token: string;

      beforeEach(async () => {
        token = await getToken.default();
      });

      it('should not allow to access due to user type is not admin', () => {
        return request(app.getHttpServer())
          .get(pathTo(-1))
          .set(headers.auth, token)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe(`OK - ${HttpStatus.OK}`, () => {
      let token: string;
      let permissionGroup: FindPermissionGroupDto;

      beforeEach(async () => {
        token = await getToken.admin();
        permissionGroup = await createPermissionGroup({
          moduleController,
          permissionController,
          permissionGroupController,
          userTypeController,
        });
      });

      afterEach(async () => {
        await repositoryManager.removeAndCheck(PermissionGroup.name, {
          id: permissionGroup.id,
        });
      });

      it('should find all the modules in permission group table by user type id', () => {
        return request(app.getHttpServer())
          .get(pathTo(permissionGroup.userType.id))
          .set(headers.auth, token)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toHaveLength(1);
            expect(response.body).toHaveProperty(
              '[0].id',
              permissionGroup.module.id,
            );
          });
      });
    });
  });

  describe('/:userTypeId/:moduleId/permissions - (GET)', () => {
    const path = `${basePath}/:userTypeId/:moduleId/permissions`;
    const pathTo = (userTypeId: number, moduleId) =>
      path
        .replace(/:userTypeId/, `${userTypeId}`)
        .replace(/:moduleId/, moduleId);

    describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
      it('should not allow to access to the route without a jwt token', () => {
        return request(app.getHttpServer())
          .get(pathTo(-1, -1))
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
      let token: string;

      beforeEach(async () => {
        token = await getToken.default();
      });

      it('should not allow to access due to user type is not admin', () => {
        return request(app.getHttpServer())
          .get(pathTo(-1, -1))
          .set(headers.auth, token)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe(`OK - ${HttpStatus.OK}`, () => {
      let token: string;
      let permissionGroup: FindPermissionGroupDto;

      beforeEach(async () => {
        token = await getToken.admin();
        permissionGroup = await createPermissionGroup({
          moduleController,
          permissionController,
          permissionGroupController,
          userTypeController,
        });
      });

      afterEach(async () => {
        await repositoryManager.removeAndCheck(PermissionGroup.name, {
          id: permissionGroup.id,
        });
      });

      it('should find all the permissions in permission group table by user type id and module id', () => {
        return request(app.getHttpServer())
          .get(pathTo(permissionGroup.userType.id, permissionGroup.module.id))
          .set(headers.auth, token)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toHaveLength(1);
          });
      });
    });
  });

  describe('/ - (POST)', () => {
    describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
      it('should not allow to access to the route without a jwt token', () => {
        return request(app.getHttpServer())
          .post(basePath)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
      let token: string;

      beforeEach(async () => {
        token = await getToken.default();
      });

      it('should not allow to access due to user type is not admin', () => {
        return request(app.getHttpServer())
          .post(basePath)
          .set(headers.auth, token)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe(`BAD_REQUEST - ${HttpStatus.BAD_REQUEST}`, () => {
      let token: string;

      beforeEach(async () => {
        token = await getToken.admin();
      });

      it('should not proceed due to lack of data sent or the data is not following the requirements', () => {
        return request(app.getHttpServer())
          .post(basePath)
          .set(headers.auth, token)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe(`CREATED - ${HttpStatus.CREATED}`, () => {
      let token: string;
      const createPermissionGroupDto: CreatePermissionGroupDto = {
        moduleId: 0,
        permissionId: 0,
        userTypeId: 0,
      };
      let permissionGroupId: number;

      beforeEach(async () => {
        token = await getToken.admin();

        const [permission, module, userType] = await Promise.all([
          createPermission({ permissionController }),
          createModule({ moduleController }),
          createUserType({ userTypeController }),
        ]);

        createPermissionGroupDto.permissionId = permission.id;
        createPermissionGroupDto.moduleId = module.id;
        createPermissionGroupDto.userTypeId = userType.id;
      });

      afterEach(async () => {
        await repositoryManager.removeAndCheck(PermissionGroup.name, {
          id: permissionGroupId,
        });
      });

      it('should create a new PermissionGroup', () => {
        return request(app.getHttpServer())
          .post(basePath)
          .set(headers.auth, token)
          .send(createPermissionGroupDto)
          .expect(HttpStatus.CREATED)
          .then((response) => {
            expect(response.body).toHaveProperty('id');

            permissionGroupId = response.body.id;
          });
      });
    });
  });
});
