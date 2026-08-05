import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TASK_TRANSITIONS,
  createProjectState,
  deriveProjectStatus,
  transitionTask,
} from '../core/state/index.js';
import { TASK_STATUSES } from '../core/contracts/index.js';

const NOW = '2026-08-05T12:00:00.000Z';

test('creates canonical state with deterministic initial values', () => {
  const state = createProjectState({
    projectId: 'PROJECT:AI_DOS',
    aiDosVersion: '1.0.0',
    taskIds: ['TASK:CONTRACTS', 'TASK:STATE'],
    now: NOW,
  });

  assert.deepEqual(state, {
    kind: 'project.state',
    schemaVersion: '1.0',
    id: 'STATE:PROJECT_AI_DOS',
    projectId: 'PROJECT:AI_DOS',
    aiDosVersion: '1.0.0',
    status: 'NOT_STARTED',
    currentSprintId: null,
    currentTaskId: null,
    taskStatuses: {
      'TASK:CONTRACTS': 'TODO',
      'TASK:STATE': 'TODO',
    },
    waitingManualActionIds: [],
    lastEvidenceId: null,
    updatedAt: NOW,
  });
});

test('rejects duplicate task IDs instead of silently overwriting state', () => {
  assert.throws(() => createProjectState({
    projectId: 'PROJECT:AI_DOS',
    aiDosVersion: '1.0.0',
    taskIds: ['TASK:DUPLICATE', 'TASK:DUPLICATE'],
    now: NOW,
  }), /DUPLICATE_TASK_ID/);
});

test('accepts a valid task transition without mutating the source state', () => {
  const source = createProjectState({
    projectId: 'PROJECT:AI_DOS',
    aiDosVersion: '1.0.0',
    taskIds: ['TASK:CONTRACTS'],
    now: NOW,
  });

  const result = transitionTask(source, 'TASK:CONTRACTS', 'IN_PROGRESS', NOW);

  assert.equal(result.ok, true);
  assert.equal(result.state.taskStatuses['TASK:CONTRACTS'], 'IN_PROGRESS');
  assert.equal(result.state.status, 'IN_PROGRESS');
  assert.equal(result.state.currentTaskId, 'TASK:CONTRACTS');
  assert.deepEqual(source.taskStatuses['TASK:CONTRACTS'], 'TODO');
});

test('rejects invalid and terminal transitions with stable diagnostics', () => {
  const source = createProjectState({
    projectId: 'PROJECT:AI_DOS',
    aiDosVersion: '1.0.0',
    taskIds: ['TASK:CONTRACTS'],
    now: NOW,
  });
  const inProgress = transitionTask(source, 'TASK:CONTRACTS', 'IN_PROGRESS', NOW).state;
  const ready = transitionTask(inProgress, 'TASK:CONTRACTS', 'READY_FOR_DEPLOY', NOW).state;
  const deploying = transitionTask(ready, 'TASK:CONTRACTS', 'DEPLOYING', NOW).state;
  const verifying = transitionTask(deploying, 'TASK:CONTRACTS', 'VERIFYING_PRODUCTION', NOW).state;
  const done = transitionTask(verifying, 'TASK:CONTRACTS', 'DONE', NOW).state;

  assert.deepEqual(transitionTask(source, 'TASK:CONTRACTS', 'DONE', NOW), {
    ok: false,
    diagnostics: [{ code: 'INVALID_TRANSITION', taskId: 'TASK:CONTRACTS', from: 'TODO', to: 'DONE' }],
  });
  assert.deepEqual(transitionTask(done, 'TASK:CONTRACTS', 'IN_PROGRESS', NOW), {
    ok: false,
    diagnostics: [{ code: 'INVALID_TRANSITION', taskId: 'TASK:CONTRACTS', from: 'DONE', to: 'IN_PROGRESS' }],
  });
  assert.deepEqual(transitionTask(source, 'TASK:MISSING', 'IN_PROGRESS', NOW), {
    ok: false,
    diagnostics: [{ code: 'UNKNOWN_TASK', taskId: 'TASK:MISSING' }],
  });

  const corrupt = { ...source, taskStatuses: { 'TASK:CONTRACTS': 'CORRUPT' } };
  assert.deepEqual(transitionTask(corrupt, 'TASK:CONTRACTS', 'IN_PROGRESS', NOW), {
    ok: false,
    diagnostics: [{ code: 'INVALID_SOURCE_STATUS', taskId: 'TASK:CONTRACTS', from: 'CORRUPT' }],
  });
});

test('derives project status from task statuses', () => {
  assert.equal(deriveProjectStatus({}), 'NOT_STARTED');
  assert.equal(deriveProjectStatus({ 'TASK:ONE': 'TODO' }), 'NOT_STARTED');
  assert.equal(deriveProjectStatus({ 'TASK:ONE': 'DONE', 'TASK:TWO': 'DONE' }), 'COMPLETED');
  assert.equal(deriveProjectStatus({ 'TASK:ONE': 'BLOCKED_DEPENDENCY' }), 'BLOCKED');
  assert.equal(deriveProjectStatus({ 'TASK:ONE': 'WAITING_MANUAL', 'TASK:TWO': 'TODO' }), 'IN_PROGRESS');
  assert.equal(deriveProjectStatus({ 'TASK:ONE': 'IN_PROGRESS', 'TASK:TWO': 'BLOCKED_DEPENDENCY' }), 'IN_PROGRESS');
});

test('transition table makes lifecycle branches explicit', () => {
  assert.deepEqual(Object.keys(TASK_TRANSITIONS).sort(), [...TASK_STATUSES].sort());
  assert.deepEqual(TASK_TRANSITIONS.TODO, ['IN_PROGRESS', 'BLOCKED_DEPENDENCY']);
  assert.deepEqual(TASK_TRANSITIONS.VERIFYING_PRODUCTION, ['DONE', 'FAILED', 'WAITING_MANUAL']);
  assert.deepEqual(TASK_TRANSITIONS.DONE, []);
});
