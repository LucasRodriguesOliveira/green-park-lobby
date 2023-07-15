import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { migrations } from '..';
import { sep } from 'path';
import { cwd } from 'process';

const result = config({
  path: `${cwd()}${sep}.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
});

console.log('Using Datasource:', result);

const {
  DATABASE_HOST: host,
  DATABASE_USER: user,
  DATABASE_PASSWORD: pass,
  DATABASE_PORT: port = '5432',
  DATABASE_NAME: name,
} = process.env;

export const PostgresMigration = new DataSource({
  type: 'postgres',
  host,
  port: parseInt(port, 10),
  username: user,
  password: pass,
  database: name,
  migrations,
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
});
