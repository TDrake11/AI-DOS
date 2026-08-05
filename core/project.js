import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { conformProject } from './conformance/index.js';
import { buildReadPlan, loadManifest } from './manifest/index.js';
import { writeProjections } from './projection/index.js';

function usage() {
  console.error('Usage: node core/project.js --manifest <path> --out <directory>');
}

function option(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

const args = process.argv.slice(2);
const manifestPath = option(args, '--manifest');
const outputDir = option(args, '--out');

if (!manifestPath || !outputDir) {
  usage();
  process.exitCode = 2;
} else {
  try {
    const conformance = conformProject({ manifestPath });
    if (!conformance.ok) {
      console.log(JSON.stringify(conformance, null, 2));
      process.exitCode = 1;
    } else {
      const records = [];
      const loaded = loadManifest(manifestPath);
      const projectRoot = dirname(resolve(manifestPath));
      const plan = buildReadPlan(loaded.manifest, projectRoot);
      if (resolve(projectRoot, outputDir) !== resolve(projectRoot, loaded.manifest.outputDirectory)) {
        console.log(JSON.stringify({
          ok: false,
          files: [],
          diagnostics: [{
            code: 'OUTPUT_DIRECTORY_MISMATCH',
            path: '--out',
            expected: loaded.manifest.outputDirectory,
            value: outputDir,
          }],
          conformance: conformance.summary,
        }, null, 2));
        process.exitCode = 1;
      } else {
        for (const entry of plan.entries.filter(({ role, exists }) => role === 'canonical_record' && exists)) {
          const parsed = JSON.parse(readFileSync(entry.absolutePath, 'utf8'));
          if (Array.isArray(parsed)) records.push(...parsed);
          else records.push(parsed);
        }
        const result = writeProjections({
          records,
          projectRoot,
          outputDir,
          context: conformance.summary,
        });
        console.log(JSON.stringify({ ...result, conformance: conformance.summary }, null, 2));
        process.exitCode = result.ok ? 0 : 1;
      }
    }
  } catch (error) {
    console.error(JSON.stringify({
      ok: false,
      diagnostics: [{ code: 'INPUT_ERROR', message: error.message }],
    }, null, 2));
    process.exitCode = 2;
  }
}
