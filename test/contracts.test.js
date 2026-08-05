import test from 'node:test';
import assert from 'node:assert/strict';

import {
  APPLICABILITY,
  CONTRACT_KINDS,
  CONTRACT_SCHEMA_VERSION,
  EVIDENCE_RESULTS,
  MANUAL_ACTION_STATUSES,
  PROJECT_STATUSES,
  TASK_STATUSES,
  getSchema,
} from '../core/contracts/index.js';

test('contract registry exposes the Phase 1 record kinds', () => {
  assert.deepEqual(CONTRACT_KINDS, [
    'project.profile',
    'roadmap',
    'sprint',
    'task',
    'manual_action',
    'evidence',
    'project.state',
  ]);
  assert.equal(CONTRACT_SCHEMA_VERSION, '1.0');
});

test('contract schemas share stable record metadata', () => {
  for (const kind of CONTRACT_KINDS) {
    const schema = getSchema(kind);

    assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
    assert.deepEqual(schema.required.slice(0, 3), ['kind', 'schemaVersion', 'id']);
    assert.equal(schema.properties.kind.const, kind);
    assert.equal(schema.properties.schemaVersion.const, CONTRACT_SCHEMA_VERSION);
    assert.match(schema.properties.id.pattern, /A-Z/);
  }
});

test('work records require agent-executable planning fields', () => {
  assert.deepEqual(getSchema('task').required, [
    'kind', 'schemaVersion', 'id', 'title', 'category', 'priority',
    'objective', 'status', 'dependencies', 'acceptanceCriteria',
    'verification', 'applicability',
  ]);
  assert.ok(getSchema('sprint').required.includes('entryCriteria'));
  assert.ok(getSchema('sprint').required.includes('exitCriteria'));
  assert.ok(getSchema('roadmap').required.includes('releaseCriteria'));
});

test('vocabularies are explicit and stable', () => {
  assert.deepEqual(APPLICABILITY, ['REQUIRED', 'OPTIONAL', 'NOT_APPLICABLE']);
  assert.ok(TASK_STATUSES.includes('DONE'));
  assert.ok(TASK_STATUSES.includes('WAITING_MANUAL'));
  assert.ok(MANUAL_ACTION_STATUSES.includes('RETEST_REQUIRED'));
  assert.deepEqual(PROJECT_STATUSES, ['NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED']);
  assert.deepEqual(EVIDENCE_RESULTS, ['PASS', 'FAIL', 'SKIPPED', 'NOT_APPLICABLE', 'BLOCKED']);
});

test('unknown contract kinds fail explicitly', () => {
  assert.throws(() => getSchema('vendor.custom'), /Unknown contract kind/);
});
