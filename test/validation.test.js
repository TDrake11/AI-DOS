import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

import { validateRecord, validateRecords } from '../core/validation/index.js';

const project = {
  kind: 'project.profile',
  schemaVersion: '1.0',
  id: 'PROJECT:AI_DOS',
  name: 'AI-DOS',
  repositoryType: 'SINGLE_REPO',
  primaryBranch: 'main',
  targetVersion: '1.0.0',
  capabilities: {
    deployment: 'NOT_APPLICABLE',
    productionVerification: 'NOT_APPLICABLE',
  },
};

const task = (id, dependencies = []) => ({
  kind: 'task',
  schemaVersion: '1.0',
  id,
  title: 'Define a contract',
  category: 'Core',
  priority: 'HIGH',
  objective: 'Create a stable contract.',
  status: 'TODO',
  dependencies,
  acceptanceCriteria: ['Contract is machine-readable.'],
  verification: ['node --test'],
  applicability: {
    tests: 'REQUIRED',
    deployment: 'NOT_APPLICABLE',
    productionVerification: 'NOT_APPLICABLE',
  },
});

test('validates a complete project profile', () => {
  assert.deepEqual(validateRecord(project), { ok: true, diagnostics: [] });
});

test('reports required-field and enum violations with stable codes', () => {
  const invalid = { ...project, name: undefined, repositoryType: 'UNKNOWN' };
  delete invalid.name;

  const result = validateRecord(invalid);
  assert.equal(result.ok, false);
  assert.deepEqual(result.diagnostics.map(({ code }) => code), [
    'REQUIRED_FIELD',
    'ENUM_VALUE',
  ]);
});

test('rejects placeholders before they reach canonical records', () => {
  const result = validateRecord({ ...project, name: '<PROJECT_NAME>' });

  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'PLACEHOLDER_VALUE'));
});

test('detects duplicate IDs across records', () => {
  const result = validateRecords([task('TASK:DUPLICATE'), task('TASK:DUPLICATE')]);

  assert.equal(result.ok, false);
  assert.deepEqual(result.diagnostics.map(({ code }) => code), ['DUPLICATE_ID']);
});

test('detects unknown dependencies and circular dependencies', () => {
  const result = validateRecords([
    task('TASK:A', ['TASK:B']),
    task('TASK:B', ['TASK:A']),
    task('TASK:C', ['TASK:MISSING']),
  ]);

  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'UNKNOWN_DEPENDENCY'));
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'DEPENDENCY_CYCLE'));
});

test('rejects unknown contract kinds without throwing', () => {
  const result = validateRecord({ kind: 'vendor.custom', schemaVersion: '1.0', id: 'VENDOR:CUSTOM' });

  assert.deepEqual(result, {
    ok: false,
    diagnostics: [{ code: 'UNKNOWN_CONTRACT_KIND', path: '$.kind', value: 'vendor.custom' }],
  });
});

test('CLI validates JSON records with a reproducible exit code', () => {
  const valid = spawnSync(process.execPath, [
    'core/validate.js',
    'test/fixtures/valid-project.json',
  ], { encoding: 'utf8' });
  const invalid = spawnSync(process.execPath, [
    'core/validate.js',
    'test/fixtures/cyclic-tasks.json',
  ], { encoding: 'utf8' });

  assert.equal(valid.status, 0);
  assert.equal(JSON.parse(valid.stdout).ok, true);
  assert.equal(invalid.status, 1);
  assert.ok(JSON.parse(invalid.stdout).diagnostics.some(({ code }) => code === 'DEPENDENCY_CYCLE'));
});
