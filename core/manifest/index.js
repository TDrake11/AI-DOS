import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';

import { validateRecord } from '../validation/index.js';

function diagnostic(code, path, details = {}, severity = 'error') {
  return { code, path, severity, ...details };
}

function isOutsideRoot(root, target) {
  const relativePath = relative(root, target);
  return relativePath === '..'
    || relativePath.startsWith('..\\')
    || relativePath.startsWith('../')
    || isAbsolute(relativePath);
}

export function loadManifest(manifestPath) {
  let parsed;

  try {
    parsed = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    return {
      ok: false,
      diagnostics: [diagnostic('INPUT_ERROR', manifestPath, { message: error.message })],
    };
  }

  const validation = validateRecord(parsed);
  if (!validation.ok) {
    return { ok: false, diagnostics: validation.diagnostics };
  }

  return { ok: true, manifest: parsed, diagnostics: [] };
}

export function buildReadPlan(manifest, projectRoot) {
  const validation = validateRecord(manifest);
  if (!validation.ok) return { ok: false, entries: [], diagnostics: validation.diagnostics };

  const root = resolve(projectRoot);
  const entries = [];
  const diagnostics = [];
  const seenIds = new Set();
  const seenPaths = new Set();

  manifest.entries.forEach((entry, index) => {
    const entryPath = `$.entries[${index}]`;
    const absolutePath = resolve(root, entry.path);

    if (seenIds.has(entry.id)) {
      diagnostics.push(diagnostic('DUPLICATE_MANIFEST_ID', `${entryPath}.id`, { id: entry.id }));
    }
    seenIds.add(entry.id);

    if (isAbsolute(entry.path)) {
      diagnostics.push(diagnostic('ABSOLUTE_PATH', `${entryPath}.path`, { value: entry.path }));
      return;
    }

    if (seenPaths.has(absolutePath)) {
      diagnostics.push(diagnostic('DUPLICATE_MANIFEST_PATH', `${entryPath}.path`, { value: entry.path }));
    }
    seenPaths.add(absolutePath);

    if (isOutsideRoot(root, absolutePath)) {
      diagnostics.push(diagnostic('PATH_ESCAPE', `${entryPath}.path`, { value: entry.path }));
      return;
    }

    const exists = existsSync(absolutePath);
    if (!exists) {
      diagnostics.push(diagnostic(
        entry.required ? 'MISSING_REQUIRED_PATH' : 'MISSING_OPTIONAL_PATH',
        `${entryPath}.path`,
        { value: entry.path },
        entry.required ? 'error' : 'warning',
      ));
    }

    entries.push({ ...entry, absolutePath, exists });
  });

  return {
    ok: diagnostics.every(({ severity }) => severity === 'warning'),
    entries,
    diagnostics,
  };
}
