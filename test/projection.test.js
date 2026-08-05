import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  renderEvidenceSummary,
  renderProjectSummary,
  renderTaskStatus,
  writeProjections,
} from '../core/projection/index.js';

const records = [
  {
    kind: 'project.profile',
    id: 'PROJECT:PROJECTION',
    name: 'Projection fixture',
    targetVersion: '1.0.0',
    executionProfile: 'not_applicable',
  },
  {
    kind: 'task',
    id: 'TASK:B',
    title: 'Second task',
  },
  {
    kind: 'task',
    id: 'TASK:A',
    title: 'First | task',
  },
  {
    kind: 'project.state',
    id: 'STATE:PROJECTION',
    status: 'IN_PROGRESS',
    taskStatuses: { 'TASK:B': 'DONE', 'TASK:A': 'IN_PROGRESS' },
    currentTaskId: 'TASK:A',
  },
  {
    kind: 'evidence',
    id: 'EVIDENCE:A',
    taskId: 'TASK:A',
    result: 'PASS',
    checks: [{ kind: 'TEST', name: 'unit tests', status: 'PASS' }],
  },
];

test('pure renderers produce deterministic summaries with safe table cells', () => {
  const context = { executionProfile: 'not_applicable', generatedAt: '2026-08-05T12:00:00.000Z' };
  const project = renderProjectSummary(records, context);
  const tasks = renderTaskStatus(records);
  const evidence = renderEvidenceSummary(records);

  assert.match(project, /# AI-DOS Project Summary/);
  assert.match(project, /Projection fixture/);
  assert.match(tasks, /TASK:A/);
  assert.match(tasks, /First \\| task/);
  assert.ok(tasks.indexOf('TASK:A') < tasks.indexOf('TASK:B'));
  assert.match(evidence, /TEST/);
  assert.equal(renderTaskStatus(records), tasks);
});

test('writer creates only generated projections under a safe directory', () => {
  const root = mkdtempSync(join(tmpdir(), 'ai-dos-projection-'));
  try {
    mkdirSync(join(root, '00-project'));
    const result = writeProjections({
      records,
      projectRoot: root,
      outputDir: '.ai-dos/generated',
      context: { executionProfile: 'not_applicable' },
    });

    assert.equal(result.ok, true);
    assert.deepEqual(result.files, [
      join(root, '.ai-dos/generated/PROJECT_SUMMARY.md'),
      join(root, '.ai-dos/generated/TASK_STATUS.md'),
      join(root, '.ai-dos/generated/EVIDENCE_SUMMARY.md'),
    ]);
    assert.ok(existsSync(result.files[0]));
    assert.match(readFileSync(result.files[1], 'utf8'), /TASK:A/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('writer rejects legacy and outside output directories', () => {
  const root = mkdtempSync(join(tmpdir(), 'ai-dos-projection-'));
  try {
    for (const outputDir of ['10-state', '../outside']) {
      const result = writeProjections({ records, projectRoot: root, outputDir });
      assert.equal(result.ok, false);
      assert.ok(result.diagnostics.some(({ code }) => code === 'OUTPUT_PATH_UNSAFE'));
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('projection CLI conforms first and writes into the manifest project root', () => {
  const root = mkdtempSync(join(tmpdir(), 'ai-dos-projection-cli-'));
  try {
    mkdirSync(join(root, 'records'));
    const cliRecords = [
      {
        kind: 'project.profile',
        schemaVersion: '1.0',
        id: 'PROJECT:CLI',
        name: 'CLI fixture',
        repositoryType: 'SINGLE_REPO',
        primaryBranch: 'main',
        targetVersion: '1.0.0',
        executionProfile: 'not_applicable',
        capabilities: { deployment: 'NOT_APPLICABLE', productionVerification: 'NOT_APPLICABLE' },
      },
      {
        kind: 'task',
        schemaVersion: '1.0',
        id: 'TASK:CLI',
        title: 'CLI task',
        category: 'Core',
        priority: 'LOW',
        objective: 'Exercise CLI.',
        dependencies: [],
        acceptanceCriteria: ['Projection is generated.'],
        verification: ['node --test'],
        applicability: { tests: 'OPTIONAL', deployment: 'NOT_APPLICABLE', productionVerification: 'NOT_APPLICABLE' },
      },
      {
        kind: 'project.state',
        schemaVersion: '1.0',
        id: 'STATE:PROJECT_CLI',
        projectId: 'PROJECT:CLI',
        aiDosVersion: '1.0.0',
        status: 'NOT_STARTED',
        currentSprintId: null,
        currentTaskId: null,
        taskStatuses: { 'TASK:CLI': 'TODO' },
        waitingManualActionIds: [],
        lastEvidenceId: null,
        updatedAt: '2026-08-05T12:00:00.000Z',
      },
    ];
    const entries = cliRecords.map((record) => ({
      id: record.kind,
      path: `records/${record.kind}.json`,
      role: 'canonical_record',
      recordKind: record.kind,
      required: true,
    }));
    for (const record of cliRecords) {
      writeFileSync(join(root, 'records', `${record.kind}.json`), JSON.stringify(record));
    }
    writeFileSync(join(root, 'manifest.json'), JSON.stringify({
      kind: 'read_order.manifest',
      schemaVersion: '1.0',
      id: 'MANIFEST:CLI',
      outputDirectory: '.ai-dos/generated',
      entries,
    }));

    const result = spawnSync(process.execPath, [
      'core/project.js', '--manifest', join(root, 'manifest.json'), '--out', '.ai-dos/generated',
    ], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.ok(existsSync(join(root, '.ai-dos/generated/PROJECT_SUMMARY.md')));

    const mismatch = spawnSync(process.execPath, [
      'core/project.js', '--manifest', join(root, 'manifest.json'), '--out', '.ai-dos/other',
    ], { encoding: 'utf8' });
    assert.equal(mismatch.status, 1);
    assert.ok(JSON.parse(mismatch.stdout).diagnostics.some(({ code }) => code === 'OUTPUT_DIRECTORY_MISMATCH'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
