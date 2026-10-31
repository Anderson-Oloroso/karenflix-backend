import { readFileSync } from 'node:fs';
import semver from 'semver';
import 'dotenv/config';

const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));

if (!semver.valid(packageJson.version)) {
    throw new Error('La versión de API en package.json debe cumplir SemVer');
}

export const API_PREFIX = process.env.API_PREFIX || '/api/v1';
export const API_VERSION = packageJson.version;
