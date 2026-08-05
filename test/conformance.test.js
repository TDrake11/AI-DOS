import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { conformProject } from '../core/conformance/index.js';

const timestamp = '2026-08-05T12:00:00.000Z';

function createRecords({ includeEvidence = true, profileOverrides = {} } = {}) {
  const records = [
    {
      kind: 'project.profile',
      schemaVersion: '1.0',
      id: 'PROJECT:CONFORMANCE',
      name: 'Conformance fixture',
      repositoryType: 'SINGLE_REPO',
      primaryBranch: 'main',
      targetVersion: '1.0.0',
      executionProfile: 'production_required',
      capabilities: {
        deployment: 'REQUIRED',
        productionVerification: 'REQUIRED',
      },
      ...profileOverrides,
    },
    {
      kind: 'task',
      schemaVersion: '1.0',
      id: 'TASK:CONFORMANCE',
      title: 'Conformance task',
      category: 'Core',
      priority: 'HIGH',
      objective: 'Validate the project contract set.',
      dependencies: [],
      acceptanceCriteria: ['The project conforms.'],
      verification: ['node --test'],
      applicability: {
        tests: 'REQUIRED',
        deployment: 'REQUIRED',
        productionVerification: 'REQUIRED',
      },
    },
    {
      kind: 'project.state',
      schemaVersion: '1.0',
      id: 'STATE:PROJECT_CONFORMANCE',
      projectId: 'PROJECT:CONFORMANCE',
      aiDosVersion: '1.0.0',
      status: 'IN_PROGRESS',
      currentSprintId: null,
      currentTaskId: 'TASK:CONFORMANCE',
      taskStatuses: { 'TASK:CONFORMANCE': 'IN_PROGRESS' },
      waitingManualActionIds: [],
      lastEvidenceId: includeEvidence ? 'EVIDENCE:CONFORMANCE' : null,
      updatedAt: timestamp,
    },
  ];

  if (includeEvidence) {
    records.push({
      kind: 'evidence',
      schemaVersion: '1.0',
      id: 'EVIDENCE:CONFORMANCE',
      taskId: 'TASK:CONFORMANCE',
      checks: [
        {
          kind: 'TEST',
          name: 'tests',
          command: 'node --test',
          artifact: 'test-results.xml',
          reference: 'run:conformance-tests',
          status: 'PASS',
        },
        { kind: 'DEPLOY', name: 'deployment', command: 'deploy fixture', status: 'PASS' },
        { kind: 'PRODUCTION', name: 'production', command: 'verify fixture', status: 'PASS' },
      ],
      result: 'PASS',
      recordedAt: timestamp,
    });
  }

  return records;
}

function writeProject(records) {
  const root = mkdtempSync(join(tmpdir(), 'ai-dos-conformance-'));
  mkdirSync(join(root, 'records'));
  const entries = records.map((record) => ({
    id: record.id.toLowerCase().replaceAll(':', '-'),
    path: `records/${record.kind}-${record.id.split(':')[1].toLowerCase()}.json`,
    role: 'canonical_record',
    recordKind: record.kind,
    required: true,
  }));
  entries.push({ id: 'readme', path: 'README.md', role: 'policy', required: true });

  records.forEach((record, index) => {
    writeFileSync(join(root, entries[index].path), JSON.stringify(record, null, 2));
  });
  writeFileSync(join(root, 'README.md'), '# Conformance fixture\n');
  writeFileSync(join(root, 'manifest.json'), JSON.stringify({
    kind: 'read_order.manifest',
    schemaVersion: '1.0',
    id: 'MANIFEST:CONFORMANCE',
    outputDirectory: '.ai-dos/generated',
    entries,
  }, null, 2));

  return { root, manifestPath: join(root, 'manifest.json') };
}

function withProject(records, callback) {
  const project = writeProject(records);
  try {
    return callback(project);
  } finally {
    rmSync(project.root, { recursive: true, force: true });
  }
}

test('conformance validates records, profile applicability and evidence coverage', () => {
  withProject(createRecords(), ({ manifestPath }) => {
    const result = conformProject({ manifestPath });

    assert.equal(result.ok, true);
    assert.deepEqual(result.summary.activeTaskIds, ['TASK:CONFORMANCE']);
    assert.deepEqual(result.summary.blockedTaskIds, []);
    assert.deepEqual(result.summary.missingEvidenceTaskIds, []);
    assert.equal(result.summary.recordCount, 4);
  });
});

test('conformance reports missing evidence as a stable project diagnostic', () => {
  withProject(createRecords({ includeEvidence: false }), ({ manifestPath }) => {
    const result = conformProject({ manifestPath });

    assert.equal(result.ok, false);
    assert.ok(result.summary.missingEvidenceTaskIds.includes('TASK:CONFORMANCE'));
    assert.ok(result.diagnostics.some(({ code }) => code === 'MISSING_REQUIRED_EVIDENCE'));
  });
});

test('conformance keeps legacy profiles usable but reports the inferred profile', () => {
  const records = createRecords();
  delete records[0].executionProfile;

  withProject(records, ({ manifestPath }) => {
    const result = conformProject({ manifestPath });

    assert.equal(result.ok, true);
    assert.equal(result.summary.executionProfile, 'production_required');
    assert.ok(result.diagnostics.some(({ code, severity }) => (
      code === 'PROFILE_INFERRED' && severity === 'warning'
    )));
  });
});

test('conformance rejects a profile whose capabilities contradict its execution profile', () => {
  withProject(createRecords({
    profileOverrides: {
      capabilities: { deployment: 'OPTIONAL', productionVerification: 'OPTIONAL' },
    },
  }), ({ manifestPath }) => {
    const result = conformProject({ manifestPath });

    assert.equal(result.ok, false);
    assert.ok(result.diagnostics.some(({ code }) => code === 'PROFILE_CAPABILITY_MISMATCH'));
  });
});

test('conformance CLI exposes stable success and usage exit codes', () => {
  withProject(createRecords(), ({ manifestPath }) => {
    const valid = spawnSync(process.execPath, [
      'core/conformance.js', '--manifest', manifestPath,
    ], { encoding: 'utf8' });
    const usage = spawnSync(process.execPath, ['core/conformance.js'], { encoding: 'utf8' });

    assert.equal(valid.status, 0);
    assert.equal(JSON.parse(valid.stdout).ok, true);
    assert.equal(usage.status, 2);
  });
});

test('conformance returns diagnostics instead of throwing on malformed canonical records', () => {
  const project = writeProject(createRecords());
  try {
    const manifest = JSON.parse(readFileSync(project.manifestPath, 'utf8'));
    manifest.entries.push({
      id: 'malformed-record',
      path: 'records/malformed.json',
      role: 'canonical_record',
      recordKind: 'task',
      required: true,
    });
    writeFileSync(project.manifestPath, JSON.stringify(manifest));
    writeFileSync(join(project.root, 'records/malformed.json'), 'null');

    const result = conformProject({ manifestPath: project.manifestPath });

    assert.equal(result.ok, false);
    assert.ok(result.diagnostics.some(({ code }) => code === 'TYPE_VALUE'));
  } finally {
    rmSync(project.root, { recursive: true, force: true });
  }
});

test('conformance does not count PASS checks inside failed evidence records', () => {
  const records = createRecords();
  records.at(-1).result = 'FAIL';

  withProject(records, ({ manifestPath }) => {
    const result = conformProject({ manifestPath });

    assert.equal(result.ok, false);
    assert.ok(result.summary.missingEvidenceTaskIds.includes('TASK:CONFORMANCE'));
    assert.ok(result.diagnostics.some(({ code }) => code === 'MISSING_REQUIRED_EVIDENCE'));
  });
});

test('conformance warns on legacy unstructured evidence and still requires typed coverage', () => {
  const records = createRecords();
  delete records.at(-1).checks[0].kind;

  withProject(records, ({ manifestPath }) => {
    const result = conformProject({ manifestPath });

    assert.equal(result.ok, false);
    assert.ok(result.diagnostics.some(({ code, severity }) => (
      code === 'UNSTRUCTURED_EVIDENCE' && severity === 'warning'
    )));
    assert.ok(result.summary.missingEvidenceTaskIds.includes('TASK:CONFORMANCE'));
  });
});

test('conformance rejects multiple project profiles explicitly', () => {
  const records = createRecords();
  records.splice(1, 0, {
    ...records[0],
    id: 'PROJECT:SECOND',
    name: 'Second profile',
  });

  withProject(records, ({ manifestPath }) => {
    const result = conformProject({ manifestPath });

    assert.equal(result.ok, false);
    assert.ok(result.diagnostics.some(({ code }) => code === 'DUPLICATE_PROJECT_PROFILE'));
  });
});
