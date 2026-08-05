import test from 'node:test';
import assert from 'node:assert/strict';

import { COMPATIBILITY_MATRIX, CONTRACT_KINDS } from '../core/contracts/index.js';

test('compatibility matrix covers every Phase 1 contract kind', () => {
  assert.equal(COMPATIBILITY_MATRIX.frameworkVersion, '1.0.0');
  assert.equal(COMPATIBILITY_MATRIX.contractVersion, '1.0');
  assert.equal(Object.isFrozen(COMPATIBILITY_MATRIX.records), true);
  assert.deepEqual(Object.keys(COMPATIBILITY_MATRIX.records), CONTRACT_KINDS);
  assert.ok(Object.values(COMPATIBILITY_MATRIX.records).every(({ status }) => status === 'SUPPORTED'));
});

test('compatibility policy rejects ambiguous future contracts', () => {
  assert.equal(COMPATIBILITY_MATRIX.readerPolicy.unknownKind, 'REJECT');
  assert.equal(COMPATIBILITY_MATRIX.readerPolicy.unknownSchemaVersion, 'REJECT');
  assert.equal(COMPATIBILITY_MATRIX.readerPolicy.newerMajor, 'REJECT_WITH_MIGRATION_REQUIRED');
});
