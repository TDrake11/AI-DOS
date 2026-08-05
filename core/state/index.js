import {
  CONTRACT_SCHEMA_VERSION,
  TASK_STATUSES,
} from '../contracts/index.js';

export const TASK_TRANSITIONS = Object.freeze({
  TODO: Object.freeze(['IN_PROGRESS', 'BLOCKED_DEPENDENCY']),
  IN_PROGRESS: Object.freeze(['READY_FOR_DEPLOY', 'WAITING_MANUAL', 'BLOCKED_DEPENDENCY', 'PARTIAL', 'FAILED']),
  WAITING_MANUAL: Object.freeze(['IN_PROGRESS', 'FAILED']),
  BLOCKED_DEPENDENCY: Object.freeze(['TODO', 'IN_PROGRESS', 'FAILED']),
  PARTIAL: Object.freeze(['IN_PROGRESS', 'READY_FOR_DEPLOY', 'WAITING_MANUAL', 'FAILED']),
  READY_FOR_DEPLOY: Object.freeze(['DEPLOYING', 'IN_PROGRESS', 'WAITING_MANUAL', 'FAILED']),
  DEPLOYING: Object.freeze(['VERIFYING_PRODUCTION', 'READY_FOR_DEPLOY', 'FAILED']),
  VERIFYING_PRODUCTION: Object.freeze(['DONE', 'FAILED', 'WAITING_MANUAL']),
  DONE: Object.freeze([]),
  FAILED: Object.freeze(['IN_PROGRESS']),
});

const ACTIVE_TASK_STATUSES = new Set([
  'IN_PROGRESS',
  'PARTIAL',
  'READY_FOR_DEPLOY',
  'DEPLOYING',
  'VERIFYING_PRODUCTION',
]);

const BLOCKED_TASK_STATUSES = new Set([
  'WAITING_MANUAL',
  'BLOCKED_DEPENDENCY',
  'FAILED',
]);

export function deriveProjectStatus(taskStatuses) {
  const statuses = Object.values(taskStatuses);

  if (statuses.length === 0 || statuses.every((status) => status === 'TODO')) {
    return 'NOT_STARTED';
  }

  if (statuses.every((status) => status === 'DONE')) {
    return 'COMPLETED';
  }

  if (statuses.some((status) => status === 'TODO' || ACTIVE_TASK_STATUSES.has(status))) {
    return 'IN_PROGRESS';
  }

  if (statuses.some((status) => BLOCKED_TASK_STATUSES.has(status))) {
    return 'BLOCKED';
  }

  return 'IN_PROGRESS';
}

function createStateId(projectId) {
  return `STATE:${projectId.replace(/[^A-Za-z0-9]+/g, '_').replace(/_+$/, '')}`;
}

export function createProjectState({ projectId, aiDosVersion, taskIds = [], now }) {
  if (new Set(taskIds).size !== taskIds.length) {
    throw new TypeError('DUPLICATE_TASK_ID: taskIds must be unique');
  }

  const taskStatuses = {};
  for (const taskId of taskIds) {
    taskStatuses[taskId] = 'TODO';
  }

  return {
    kind: 'project.state',
    schemaVersion: CONTRACT_SCHEMA_VERSION,
    id: createStateId(projectId),
    projectId,
    aiDosVersion,
    status: deriveProjectStatus(taskStatuses),
    currentSprintId: null,
    currentTaskId: null,
    taskStatuses,
    waitingManualActionIds: [],
    lastEvidenceId: null,
    updatedAt: now,
  };
}

function failure(code, details) {
  return { ok: false, diagnostics: [{ code, ...details }] };
}

export function transitionTask(state, taskId, nextStatus, now) {
  if (!Object.hasOwn(state.taskStatuses, taskId)) {
    return failure('UNKNOWN_TASK', { taskId });
  }

  if (!TASK_STATUSES.includes(nextStatus)) {
    return failure('UNKNOWN_TASK_STATUS', { taskId, to: nextStatus });
  }

  const from = state.taskStatuses[taskId];
  if (!TASK_STATUSES.includes(from)) {
    return failure('INVALID_SOURCE_STATUS', { taskId, from });
  }

  if (!TASK_TRANSITIONS[from].includes(nextStatus)) {
    return failure('INVALID_TRANSITION', { taskId, from, to: nextStatus });
  }

  const taskStatuses = { ...state.taskStatuses, [taskId]: nextStatus };
  const currentTaskId = nextStatus === 'DONE' && state.currentTaskId === taskId
    ? null
    : taskId;

  return {
    ok: true,
    state: {
      ...state,
      status: deriveProjectStatus(taskStatuses),
      currentTaskId,
      taskStatuses,
      updatedAt: now,
    },
  };
}
