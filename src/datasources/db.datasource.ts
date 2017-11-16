import * as path from 'path';
import * as fs from 'fs';
import { DataSourceConstructor } from '@loopback/repository';

const dsConfigPath = path.resolve('config', 'datasources.json');
const config = JSON.parse(fs.readFileSync(dsConfigPath, 'utf8'));

// TODO(bajtos) Ideally, datasources should be created by @loopback/boot
// and registered with the app for dependency injection.
// However, we need to investigate how to access these datasources from
// integration tests where we don't have access to the full app object.
// For example, @loopback/boot can provide a helper function for
// performing a partial boot that creates datasources only.
export const db = new DataSourceConstructor(config);
