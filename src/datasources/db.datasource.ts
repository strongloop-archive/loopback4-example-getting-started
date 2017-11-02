import * as path from 'path';
import * as fs from 'fs';
import { DataSourceConstructor } from '@loopback/repository';

const dsConfigPath = path.resolve('config', 'datasources.json');
const config = JSON.parse(fs.readFileSync(dsConfigPath, 'utf8'));

export const db = new DataSourceConstructor(config);
