import { readFileSync } from 'node:fs';
import { validateRecords } from './validation/index.js';

function usage() {
  console.error('Usage: node core/validate.js <record.json> [more-records.json]');
}

function readRecords(paths) {
  const records = [];
  for (const path of paths) {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    if (Array.isArray(parsed)) records.push(...parsed);
    else records.push(parsed);
  }
  return records;
}

const paths = process.argv.slice(2);
if (paths.length === 0) {
  usage();
  process.exitCode = 2;
} else {
  try {
    const result = validateRecords(readRecords(paths));
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.ok ? 0 : 1;
  } catch (error) {
    console.error(JSON.stringify({
      ok: false,
      diagnostics: [{ code: 'INPUT_ERROR', message: error.message }],
    }, null, 2));
    process.exitCode = 2;
  }
}
