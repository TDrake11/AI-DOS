import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

import { CONTRACT_KINDS, getSchema } from '../core/contracts/index.js';
import { buildReadPlan, loadManifest } from '../core/manifest/index.js';

const fixtureRoot = resolve('test/fixtures/manifest-root');

const manifest = {
  kind: 'read_order.manifest',
  schemaVersion: '1.0',
  id: 'MANIFEST:AI_DOS',
  outputDirectory: '.ai-dos/generated',
  entries: [
    {
      id: 'project-profile',
      path: 'records/project.profile.json',
      role: 'canonical_record',
      recordKind: 'project.profile',
      required: true,
      rationale: 'Project context.',
    },
    {
      id: 'framework-readme',
      path: 'README.md',
      role: 'policy',
      required: true,
      rationale: 'Framework orientation.',
    },
  ],
};

test('manifest is a registered contract with deterministic entry metadata', () => {
  assert.ok(CONTRACT_KINDS.includes('read_order.manifest'));
  const schema = getSchema('read_order.manifest');
  assert.deepEqual(schema.required.slice(0, 3), ['kind', 'schemaVersion', 'id']);
  assert.ok(schema.properties.entries.items.required.includes('role'));
});

test('loads a manifest and resolves entries in declared order', () => {
  const loaded = loadManifest('test/fixtures/manifest-root/manifest.json');
  assert.equal(loaded.ok, true);

  const plan = buildReadPlan(loaded.manifest, fixtureRoot);
  assert.equal(plan.ok, true);
  assert.deepEqual(plan.entries.map(({ id }) => id), ['project-profile', 'framework-readme']);
  assert.ok(plan.entries.every(({ absolutePath }) => absolutePath.startsWith(fixtureRoot)));
});

test('reports missing required and optional paths differently', () => {
  const result = buildReadPlan({
    ...manifest,
    entries: [
      ...manifest.entries,
      { id: 'required-missing', path: 'missing.json', role: 'canonical_record', required: true },
      { id: 'optional-missing', path: 'optional.md', role: 'handoff', required: false },
    ],
  }, fixtureRoot);

  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some(({ code }) => code === 'MISSING_REQUIRED_PATH'));
  assert.ok(result.diagnostics.some(({ code }) => code === 'MISSING_OPTIONAL_PATH'));
});

test('rejects duplicate entries and paths escaping project root', () => {
  const result = buildReadPlan({
    ...manifest,
    entries: [
      ...manifest.entries,
      { id: 'project-profile', path: 'other.json', role: 'policy', required: false },
      { id: 'escape', path: '../outside.json', role: 'policy', required: false },
      { id: 'duplicate-path', path: 'README.md', role: 'policy', required: false },
    ],
  }, fixtureRoot);

  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some(({ code }) => code === 'DUPLICATE_MANIFEST_ID'));
  assert.ok(result.diagnostics.some(({ code }) => code === 'PATH_ESCAPE'));
  assert.ok(result.diagnostics.some(({ code }) => code === 'DUPLICATE_MANIFEST_PATH'));
});

test('rejects absolute paths and duplicate normalized paths', () => {
  const result = buildReadPlan({
    ...manifest,
    entries: [
      ...manifest.entries,
      { id: 'normalized-duplicate', path: './README.md', role: 'policy', required: false },
      { id: 'absolute', path: resolve(fixtureRoot, 'absolute.json'), role: 'policy', required: false },
    ],
  }, fixtureRoot);

  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some(({ code }) => code === 'DUPLICATE_MANIFEST_PATH'));
  assert.ok(result.diagnostics.some(({ code }) => code === 'ABSOLUTE_PATH'));
});

test('rejects unsafe generated directories declared by the manifest', () => {
  for (const outputDirectory of ['../outside', '10-state', '10-STATE']) {
    const result = buildReadPlan({ ...manifest, outputDirectory }, fixtureRoot);

    assert.equal(result.ok, false);
    assert.ok(result.diagnostics.some(({ code }) => code === 'OUTPUT_DIRECTORY_UNSAFE'));
  }
});
