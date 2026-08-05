import { conformProject } from './conformance/index.js';

function usage() {
  console.error('Usage: node core/conformance.js --manifest <path>');
}

const args = process.argv.slice(2);
const manifestIndex = args.indexOf('--manifest');
const manifestPath = manifestIndex >= 0 ? args[manifestIndex + 1] : undefined;

if (!manifestPath) {
  usage();
  process.exitCode = 2;
} else {
  try {
    const result = conformProject({ manifestPath });
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
