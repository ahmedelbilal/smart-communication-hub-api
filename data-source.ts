import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

const certPath = path.resolve(__dirname, 'certs/ca-certificate.crt');
const ca = fs.readFileSync(certPath).toString();

export const AppDataSource = new DataSource({
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  entities: [join(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'src/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: true,
  ssl: { ca },
});
