import { HttpStatus, INestApplication } from '@nestjs/common';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { TicketController } from '../src/modules/ticket/ticket.controller';
import { In, Repository } from 'typeorm';
import { Ticket } from '../src/modules/ticket/entity/ticket.entity';
import { Batch } from '../src/modules/batch/entity/batch.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from '../src/config/env/env.config';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { TicketModule } from '../src/modules/ticket/ticket.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { cwd } from 'process';
import { readdirSync } from 'fs';
import { randomBytes, randomInt } from 'crypto';
import { QueryTicketDto } from '../src/modules/ticket/dto/query-ticket.dto';
import { ReportOptions } from '../src/modules/ticket/type/report-options.enum';

describe('TicketController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/ticket';
  const headers = {
    auth: 'authorization',
  };

  let ticketController: TicketController;
  let ticketRepository: Repository<Ticket>;
  let batchRepository: Repository<Batch>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeOrmPostgresModule,
        UserTypeModule,
        UserModule,
        AuthModule,
        TicketModule,
      ],
    }).compile();

    ticketController = moduleFixture.get<TicketController>(TicketController);
    ticketRepository = moduleFixture.get<Repository<Ticket>>(
      getRepositoryToken(Ticket),
    );
    batchRepository = moduleFixture.get<Repository<Batch>>(
      getRepositoryToken(Batch),
    );

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'Ticket.e2e',
    });
  });

  afterAll(async () => {
    await getToken.clear();
    await app.close();
  });

  it('should be defined', () => {
    expect(ticketRepository).toBeDefined();
    expect(batchRepository).toBeDefined();
    expect(ticketController).toBeDefined();
  });

  describe('/integration', () => {
    const path = `${basePath}/integration`;

    describe('(POST)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .post(path)
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
            .post(path)
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        const filePath = `${cwd()}/mocks/planilha boletos.csv`;
        let ticketIds: number[];
        let batchIds: number[];

        beforeAll(async () => {
          token = await getToken.admin();
          const batchList = await batchRepository.save([
            { name: '17' },
            { name: '18' },
            { name: '19' },
          ]);

          batchIds = batchList.map((batch) => batch.id);
        });

        afterAll(async () => {
          await ticketRepository.delete({
            id: In(ticketIds),
          });
          await batchRepository.delete({
            id: In(batchIds),
          });
        });

        it('should receive a csv file and store de data in ticket table and return the result', () => {
          return request(app.getHttpServer())
            .post(path)
            .set(headers.auth, token)
            .attach('file', filePath)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('length', 3);

              ticketIds = response.body.map((ticket) => ticket.id);
            });
        });
      });
    });
  });

  describe('/', () => {
    describe('(POST)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .post(basePath)
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
            .post(basePath)
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        const filePath = `${cwd()}/mocks/BOLETOS.pdf`;

        let batchList: Batch[];
        let ticketList: Ticket[];

        beforeAll(async () => {
          token = await getToken.admin();
          batchList = await batchRepository.save([
            { name: '17' },
            { name: '18' },
            { name: '19' },
          ]);

          ticketList = await ticketRepository.save([
            ...batchList.map((batch) => ({
              batch,
              name: randomBytes(10).toString('hex'),
              value: randomInt(50, 300),
              code: randomBytes(10).toString('hex'),
            })),
          ]);
        });

        afterAll(async () => {
          await ticketRepository.delete({
            id: In(ticketList.map((ticket) => ticket.id)),
          });
          await batchRepository.delete({
            id: In(batchList.map((batch) => batch.id)),
          });
        });

        it('should receive a csv file and store de data in ticket table and return the result', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .attach('file', filePath)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              const result = readdirSync(`${cwd()}/boletos`, {
                withFileTypes: true,
              });

              expect(result).toHaveLength(response.body.length);

              result.forEach(({ name }) => {
                const [fileName, fileExtesion] = name.split('.');

                expect(fileName).toMatch(/\d{1,}/);
                expect(fileExtesion).toBe('pdf');
              });
            });
        });
      });
    });

    describe('(GET)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .get(basePath)
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
            .get(basePath)
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        const queryTicketDto: QueryTicketDto = {
          report: ReportOptions.BASE64,
        };
        let token: string;

        let batchList: Batch[];
        let ticketList: Ticket[];

        beforeAll(async () => {
          token = await getToken.admin();
          batchList = await batchRepository.save([
            { name: '17' },
            { name: '18' },
            { name: '19' },
          ]);

          ticketList = await ticketRepository.save([
            ...batchList.map((batch) => ({
              batch,
              name: randomBytes(10).toString('hex'),
              value: randomInt(50, 300),
              code: randomBytes(10).toString('hex'),
            })),
          ]);
        });

        afterAll(async () => {
          await ticketRepository.delete({
            id: In(ticketList.map((ticket) => ticket.id)),
          });
          await batchRepository.delete({
            id: In(batchList.map((batch) => batch.id)),
          });
        });

        it('should return a base64 result for the tickets queried', () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set(headers.auth, token)
            .query(queryTicketDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('base64');
              expect(response.body.base64.length).toBeGreaterThan(500);
            });
        });
      });
    });
  });
});
